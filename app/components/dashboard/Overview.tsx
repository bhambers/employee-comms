"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Bell, AlertTriangle, MessageSquare } from "lucide-react"

interface OverviewProps {
  unreadCount: number
  urgentCount: number
  totalMessages: number
}

export function Overview({ unreadCount, urgentCount, totalMessages }: OverviewProps) {
  return (
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
  )
}
