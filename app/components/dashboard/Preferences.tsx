"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface PreferencesProps {
  emailNotifications: string
  onEmailChange: (value: string) => void
  pushNotifications: boolean
  onPushChange: (checked: boolean) => void
  fcmToken: string | null
  onSendTest: () => void
}

export function Preferences({
  emailNotifications,
  onEmailChange,
  pushNotifications,
  onPushChange,
  fcmToken,
  onSendTest,
}: PreferencesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Customize how you receive failover notification, across various categories.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications">Email Notifications</Label>
          <Select value={emailNotifications} onValueChange={onEmailChange}>
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
          <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={onPushChange} />
        </div>
        {fcmToken && (
          <Button className="w-full" onClick={onSendTest}>
            Send Test Notification
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
