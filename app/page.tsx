"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, MessageSquare, AlertTriangle, Users, Settings, HelpCircle, User, Search, Menu, X, Flame, Info, ShieldAlert } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { initializeFirebase, requestNotificationPermission, onMessageListener } from "./lib/firebase"
import { NotificationModal } from "./components/NotificationModal"

interface Notification {
  id: string
  title: string
  message: string
  type: "urgent" | "info" | "warning" | "critical"
  timestamp: Date
  acknowledged: boolean
  category: string
  details?: {
    // Fields for product withdrawal
    product?: string
    issue?: string
    locations?: string
    dateIdentified?: Date
    actionRequiredBy?: Date
    helpLink?: string
    consequences?: string
    actionRequired?: string[]

    // Fields for travel disruption
    incident?: string
    impact?: string

    // Fields for escalation
    escalated?: boolean
    escalationTime?: Date
    escalatedTo?: string
  }
}

export default function EmployeeCommsApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null)

  const [emailNotifications, setEmailNotifications] = useState("daily")
  const [pushNotifications, setPushNotifications] = useState(true)
  const [fcmToken, setFcmToken] = useState<string | null>(null)
  const [criticalActionItems, setCriticalActionItems] = useState<Record<string, boolean>>({
    "Remove all affected stock immediately and dispose of as per process.": false,
    "Confirm withdrawal and disposal via proper process by 12/07/2025 17:00 using the button below.": false,
  })
  const [countdown, setCountdown] = useState<Record<string, string>>({})

  useEffect(() => {
    const timer = setInterval(() => {
      notifications.forEach((n) => {
        if (n.details?.escalationTime) {
          const now = new Date().getTime()
          const distance = n.details.escalationTime.getTime() - now
          if (distance > 0) {
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((distance % (1000 * 60)) / 1000)
            setCountdown((prev) => ({ ...prev, [n.id]: `${hours}h ${minutes}m ${seconds}s` }))
          } else {
            setCountdown((prev) => ({ ...prev, [n.id]: "EXPIRED" }))
          }
        }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [notifications])

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const setupFirebaseMessaging = async () => {
      setNotifications([
        {
          id: "5",
          title: "Travel Disruption – Expect Delays This Morning Getting to Site X",
          message: "There has been an accident on the M6 motorway effecting travel times.",
          type: "critical",
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          acknowledged: false,
          category: "Travel Alert",
          details: {
            incident: "M6 closed near Warrington due to multi-vehicle accident.",
            locations: "Site X",
            impact: "Delays of up to 60 minutes expected. Please allow extra time for travel.",
            actionRequired: ["None – for awareness only."],
          },
        },
        {
          id: "4",
          title: "URGENT: Immediate Withdrawal of Gourmet Beef Pies – Action Required",
          message: "Gourmet Beef Pies must be withdrawn from all locations due to potential undeclared allergen contamination (peanuts).",
          type: "critical",
          timestamp: new Date(),
          acknowledged: false,
          category: "Food Safety",
          details: {
            product: "Gourmet Beef Pies. SKU: 506000283456",
            issue: "Allergen not declared: Peanuts",
            locations: "All UK Stores",
            dateIdentified: new Date("2025-07-12T09:00:00Z"),
            actionRequiredBy: new Date("2025-07-12T17:00:00Z"),
            helpLink: "/procedures/food-withdrawal",
            consequences: "Customer/Colleague serious health risk.",
            actionRequired: [
              "Remove all affected stock immediately and dispose of as per process.",
              "Confirm withdrawal and disposal via proper process by 12/07/2025 17:00 using the button below.",
            ],
          },
        },
        {
          id: "1",
          title: "Ingredient Substitution Required",
          message: "Allergen alert: Replace peanut oil with sunflower oil in Recipe #247",
          type: "urgent",
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          acknowledged: false,
          category: "Safety",
          details: {
            escalated: true,
            escalatedTo: "Jane Doe (Line Manager)",
            escalationTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        },
        {
          id: "2",
          title: "Shift Schedule Update",
          message: "Your shift on Friday has been moved to 2 PM - 10 PM",
          type: "info",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          acknowledged: true,
          category: "Schedule",
        },
        {
          id: "3",
          title: "Equipment Maintenance",
          message: "Oven #3 will be offline for maintenance from 3-5 PM today",
          type: "warning",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          acknowledged: false,
          category: "Operations",
        },
      ]);
      initializeFirebase();

      const { token, messaging } = await requestNotificationPermission();
      setFcmToken(token);

      const showModal = (notification: Notification) => {
        setCurrentNotification(notification);
        setModalOpen(true);
      };

      if (messaging) {
        unsubscribe = onMessageListener(messaging, showModal);
      }
    };

    setupFirebaseMessaging();

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [])

  const addNotificationAndCloseModal = () => {
    if (currentNotification) {
      setNotifications((prev) => {
        // Prevent duplicates
        if (prev.some((n) => n.id === currentNotification.id)) {
          return prev;
        }
        // Add the new notification, keeping acknowledged: false
        return [currentNotification, ...prev];
      });
    }
    setModalOpen(false);
    setCurrentNotification(null);
  };

  const acknowledgeNotification = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, acknowledged: true } : notif)))
  }

  const unreadCount = notifications.filter((n) => !n.acknowledged).length
  const urgentCount = notifications.filter((n) => n.type === "urgent" && !n.acknowledged).length
  const totalMessages = notifications.length

  const sidebarItems = [
    { icon: Bell, label: "Dashboard", active: true },
    { icon: Bell, label: "Notifications", active: false },
    { icon: MessageSquare, label: "Analytics", active: false },
    { icon: Users, label: "Social", active: false },
    { icon: Settings, label: "Settings", active: false },
    { icon: HelpCircle, label: "Help & Support", active: false },
    { icon: User, label: "Profile", active: false },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg">The Pushy Pals</span>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {sidebarItems.map((item, index) => (
            <Button
              key={index}
              variant={item.active ? "default" : "ghost"}
              className={`w-full justify-start ${item.active ? "bg-orange-500 hover:bg-orange-600" : ""}`}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-4 h-4" />
              </Button>
              <h1 className="text-xl font-semibold">Notification Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search anything..." className="pl-10 w-64" />
              </div>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="xl:col-span-2 space-y-6">
              {/* Overview Cards */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Your Notification Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
                          <p className="text-sm text-gray-600">New Unread</p>
                        </div>
                        <Bell className="w-8 h-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-red-600">{urgentCount}</p>
                          <p className="text-sm text-gray-600">Urgent Alerts</p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-blue-600">{totalMessages}</p>
                          <p className="text-sm text-gray-600">Total Messages</p>
                        </div>
                        <MessageSquare className="w-8 h-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Bell className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Dashboard Overview</h3>
                          <p className="text-sm text-gray-600">View your key metrics and insights.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Settings className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Manage Notifications</h3>
                          <p className="text-sm text-gray-600">Configure your alert preferences.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Account Settings</h3>
                          <p className="text-sm text-gray-600">Update profile, security, and billing.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Performance Reports</h3>
                          <p className="text-sm text-gray-600">Access detailed analytics and reports.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Recent Activity  */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-200">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 transition-colors duration-150 ${
                          notification.details?.incident ? "bg-orange-50 hover:bg-orange-100" : ""
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                            {notification.details?.incident ? (
                              <AlertTriangle className="w-5 h-5 text-orange-500" />
                            ) : (
                              <>
                                {notification.type === "critical" && <ShieldAlert className="w-5 h-5 text-purple-700" />}
                                {notification.type === "urgent" && <Flame className="w-5 h-5 text-red-500" />}
                                {notification.type === "warning" && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                                {notification.type === "info" && <Info className="w-5 h-5 text-blue-500" />}
                              </>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-gray-900 truncate">{notification.title}</p>
                              <div className="flex items-center space-x-2">
                                {!notification.acknowledged && (
                                  <Badge variant="destructive" className="text-xs">
                                    New
                                  </Badge>
                                )}
                                <p className="text-xs text-gray-500">
                                  {notification.timestamp.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>

                            {notification.details?.escalated && (
                              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center">
                                  <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />
                                  <p className="text-xs font-semibold text-red-800">
                                    Not actioned. Escalated to: {notification.details.escalatedTo}
                                  </p>
                                </div>
                                <p className="text-xs text-red-700 mt-1">
                                  Time remaining to action:{" "}
                                  <span className="font-bold">{countdown[notification.id]}</span>
                                </p>
                              </div>
                            )}

                            {notification.type === "critical" && notification.details && (
                              <div className="text-xs text-gray-600 mt-2 space-y-1">
                                {/* Product Withdrawal Details */}
                                {notification.details.product && (
                                  <>
                                    <p><strong>Product:</strong> {notification.details.product}</p>
                                    <p><strong>Issue:</strong> {notification.details.issue}</p>
                                  </>
                                )}

                                {/* Travel Disruption Details */}
                                {notification.details.incident && (
                                  <p><strong>Incident:</strong> {notification.details.incident}</p>
                                )}

                                {/* Common Details */}
                                {notification.details.locations && <p><strong>Location(s):</strong> {notification.details.locations}</p>}
                                {notification.details.impact && <p><strong>Impact:</strong> {notification.details.impact}</p>}
                                {notification.details.actionRequiredBy && <p><strong>Action Required By:</strong> {notification.details.actionRequiredBy?.toLocaleString()}</p>}

                                {/* Action Required Section */}
                                {notification.details.actionRequired && (
                                  <div className="pt-2">
                                    <p className="font-semibold">Action Required:</p>
                                    {notification.details.actionRequired?.[0] === "None – for awareness only." ? (
                                      <p>{notification.details.actionRequired?.[0]}</p>
                                    ) : (
                                      <div className="space-y-2 mt-1">
                                        {notification.details.actionRequired?.map((action, i) => (
                                          <div key={i} className="flex items-center space-x-2">
                                            <Checkbox
                                              id={`action-${notification.id}-${i}`}
                                              checked={criticalActionItems[action]}
                                              onCheckedChange={(checked) => {
                                                setCriticalActionItems((prev) => ({ ...prev, [action]: !!checked }))
                                              }}
                                            />
                                            <label
                                              htmlFor={`action-${notification.id}-${i}`}
                                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                              {action}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Consequences and Help Link */}
                                {notification.details.consequences && <p className="pt-2"><strong>Consequences of non-compliance:</strong> {notification.details.consequences}</p>}
                                {notification.details.helpLink && (
                                  <Button variant="link" className="text-xs p-0 h-auto text-orange-600" onClick={() => alert(`Redirecting to ${notification.details?.helpLink}`)}>
                                    Refer to process and procedures for further guidance
                                  </Button>
                                )}
                              </div>
                            )}

                            <div className="mt-2">
                              {!notification.acknowledged && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => acknowledgeNotification(notification.id)}
                                  className="text-xs"
                                >
                                  Acknowledge
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Notification Preferences */}
            <div className="space-y-6">
                <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Customize how you receive failover notification, across various categories.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <Select value={emailNotifications} onValueChange={setEmailNotifications}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <Switch
                      id="push-notifications"
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                  {fcmToken && (
                    <Button
                      className="w-full"
                      onClick={async () => {
                        await fetch("/api/send-notification", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            token: fcmToken,
                            title: "Ingredient Substitution Required",
                            body: "Allergen alert: Replace peanut oil with sunflower oil in Recipe 93000001",
                          }),
                        })
                      }}
                    >
                      Send Test Notification
                    </Button>
                  )}
                </CardContent>
              </Card>
              

              {/* Featured Updates */}
              <Card>
                <CardHeader>
                  <CardTitle>Featured Updates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Bell className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Enhanced Email Templates</h4>
                        <p className="text-xs text-gray-600">
                          Beautifully designed, responsive email templates for all your alerts.
                        </p>
                        <Button variant="link" className="text-xs p-0 h-auto text-orange-600">
                          Learn More
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">New Announcement Feature</h4>
                        <p className="text-xs text-gray-600">
                          Create and broadcast urgent announcements to your entire team.
                        </p>
                        <Button variant="link" className="text-xs p-0 h-auto text-blue-600">
                          Explore
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Settings className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">System Stability Improvements</h4>
                        <p className="text-xs text-gray-600">
                          Backend optimizations for faster and more reliable notification delivery.
                        </p>
                        <Button variant="link" className="text-xs p-0 h-auto text-green-600">
                          Read Patch Notes
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      <NotificationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        notification={currentNotification}
        onConfirm={addNotificationAndCloseModal}
      />
    </div>
  )
}
