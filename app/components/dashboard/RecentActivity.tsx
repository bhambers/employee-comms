"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertTriangle, Flame, Info, ShieldAlert } from "lucide-react"

// Keep the Notification interface in a shared types file in a real app
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

interface RecentActivityProps {
  notifications: Notification[]
  criticalActionItems: Record<string, boolean>
  countdown: Record<string, string>
  onAcknowledge: (id: string) => void
  onActionItemChange: (action: string, checked: boolean) => void
}

export function RecentActivity({
  notifications,
  criticalActionItems,
  countdown,
  onAcknowledge,
  onActionItemChange,
}: RecentActivityProps) {
  return (
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
                        Time remaining to action: <span className="font-bold">{countdown[notification.id]}</span>
                      </p>
                    </div>
                  )}

                  {notification.type === "critical" && notification.details && (
                    <div className="text-xs text-gray-600 mt-2 space-y-1">
                      {notification.details.product && (
                        <>
                          <p><strong>Product:</strong> {notification.details.product}</p>
                          <p><strong>Issue:</strong> {notification.details.issue}</p>
                        </>
                      )}
                      {notification.details.incident && <p><strong>Incident:</strong> {notification.details.incident}</p>}
                      {notification.details.locations && <p><strong>Location(s):</strong> {notification.details.locations}</p>}
                      {notification.details.impact && <p><strong>Impact:</strong> {notification.details.impact}</p>}
                      {notification.details.actionRequiredBy && <p><strong>Action Required By:</strong> {notification.details.actionRequiredBy?.toLocaleString()}</p>}
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
                                    onCheckedChange={(checked) => onActionItemChange(action, !!checked)}
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
                        onClick={() => onAcknowledge(notification.id)}
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
  )
}
