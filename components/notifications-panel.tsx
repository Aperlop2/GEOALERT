"use client"

import { formatDistanceToNow } from "date-fns"
import { X, Bell, AlertTriangle, TrendingUp, Info, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Notification } from "@/lib/types"

interface NotificationsPanelProps {
  notifications: Notification[]
  isOpen: boolean
  onClose: () => void
  onMarkRead: (id: string) => void
  onEventClick: (eventId: string) => void
}

const typeIcons = {
  alert_increase: TrendingUp,
  new_event: AlertTriangle,
  status_change: Info,
  recommendation: CheckCircle2,
}

const levelColors = {
  critical: "border-l-alert-critical bg-alert-critical/5",
  warning: "border-l-alert-warning bg-alert-warning/5",
  moderate: "border-l-alert-moderate bg-alert-moderate/5",
  low: "border-l-alert-low bg-alert-low/5",
}

export function NotificationsPanel({
  notifications,
  isOpen,
  onClose,
  onMarkRead,
  onEventClick,
}: NotificationsPanelProps) {
  if (!isOpen) return null

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-end p-4">
      <Card className="w-full max-w-md bg-card border-border mt-16 mr-4">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {sortedNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1">No notifications</h3>
              <p className="text-xs text-muted-foreground">
                {"You're"} all caught up!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {sortedNotifications.map((notification) => {
                const Icon = typeIcons[notification.type]
                return (
                  <button
                    key={notification.id}
                    onClick={() => {
                      onMarkRead(notification.id)
                      onEventClick(notification.eventId)
                    }}
                    className={cn(
                      "w-full text-left p-4 border-l-4 transition-colors hover:bg-secondary/50",
                      levelColors[notification.alertLevel],
                      !notification.read && "bg-secondary/30"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={cn(
                            "text-sm text-foreground",
                            !notification.read && "font-medium"
                          )}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <span className="text-xs text-muted-foreground mt-2 block">
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <Button variant="outline" size="sm" className="w-full">
            Mark all as read
          </Button>
        </div>
      </Card>
    </div>
  )
}
