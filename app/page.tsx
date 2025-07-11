"use client"

import { useState, useEffect } from "react"
import { initializeFirebase, requestNotificationPermission, onMessageListener } from "./lib/firebase"
import { NotificationModal } from "./components/NotificationModal"

// Import the new dashboard components
import { Sidebar } from "./components/dashboard/Sidebar"
import { Header } from "./components/dashboard/Header"
import { Overview } from "./components/dashboard/Overview"
import { QuickLinks } from "./components/dashboard/QuickLinks"
import { RecentActivity } from "./components/dashboard/RecentActivity"
import { Preferences } from "./components/dashboard/Preferences"
import { FeaturedUpdates } from "./components/dashboard/FeaturedUpdates"

// In a real app, this would be in a shared types file
interface Notification {
  id: string
  title: string
  message: string
  type: "urgent" | "info" | "warning" | "critical"
  timestamp: Date
  acknowledged: boolean
  category: string
  details?: {
    product?: string
    issue?: string
    locations?: string
    dateIdentified?: Date
    actionRequiredBy?: Date
    helpLink?: string
    consequences?: string
    actionRequired?: string[]
    incident?: string
    impact?: string
    escalated?: boolean
    escalatedTo?: string
    escalationTime?: Date
  }
}

export default function EmployeeCommsApp() {
  // State Management
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

  // Effects
  useEffect(() => {
    // Initial data and Firebase setup
    const setup = async () => {
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
      ])

      initializeFirebase()
      const { token, messaging } = await requestNotificationPermission()
      setFcmToken(token)

      if (messaging) {
        const unsubscribe = onMessageListener(messaging, (notification: Notification) => {
          setCurrentNotification(notification)
          setModalOpen(true)
        })
        return unsubscribe
      }
    }

    const unsubscribePromise = setup()

    return () => {
      unsubscribePromise.then((unsubscribe) => {
        if (unsubscribe) {
          unsubscribe()
        }
      })
    }
  }, [])

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

  // Event Handlers
  const addNotificationAndCloseModal = () => {
    if (currentNotification) {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === currentNotification.id)) return prev
        return [currentNotification, ...prev]
      })
    }
    setModalOpen(false)
    setCurrentNotification(null)
  }

  const acknowledgeNotification = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, acknowledged: true } : notif)))
  }

  const handleActionItemChange = (action: string, checked: boolean) => {
    setCriticalActionItems((prev) => ({ ...prev, [action]: checked }))
  }

  const handleSendTestNotification = async () => {
    await fetch("/api/send-notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: fcmToken,
        title: "Test Notification",
        body: "This is a test from the app!",
      }),
    })
  }

  // Derived State
  const unreadCount = notifications.filter((n) => !n.acknowledged).length
  const urgentCount = notifications.filter((n) => n.type === "urgent" && !n.acknowledged).length
  const totalMessages = notifications.length

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <Overview unreadCount={unreadCount} urgentCount={urgentCount} totalMessages={totalMessages} />
              <QuickLinks />
              <RecentActivity
                notifications={notifications}
                criticalActionItems={criticalActionItems}
                countdown={countdown}
                onAcknowledge={acknowledgeNotification}
                onActionItemChange={handleActionItemChange}
              />
            </div>

            <div className="space-y-6">
              <Preferences
                emailNotifications={emailNotifications}
                onEmailChange={setEmailNotifications}
                pushNotifications={pushNotifications}
                onPushChange={setPushNotifications}
                fcmToken={fcmToken}
                onSendTest={handleSendTestNotification}
              />
              <FeaturedUpdates />
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