"use client"

import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface NotificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  notification: {
    title: string
    message: string
    timestamp: Date
  } | null
  onConfirm: () => void
}

export function NotificationModal({ open, onOpenChange, notification, onConfirm }: NotificationModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{notification?.title}</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="text-sm text-muted-foreground">
          <p>{notification?.message}</p>
          {notification?.timestamp && (
            <p className="text-xs text-gray-500 mt-2">
              {notification.timestamp.toLocaleString()}
            </p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onConfirm}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
