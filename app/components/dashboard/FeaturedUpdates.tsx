"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, MessageSquare, Settings } from "lucide-react"

export function FeaturedUpdates() {
  return (
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
  )
}
