"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Bookmark, ChevronLeft, Trash2, ExternalLink, MapPin } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { EventIcon, AlertBadge } from "@/components/event-icons"
import { EmergencyContacts } from "@/components/emergency-contacts"
import { NotificationsPanel } from "@/components/notifications-panel"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockEvents, mockUser, emergencyContacts, mockNotifications } from "@/lib/mock-data"
import type { NaturalEvent } from "@/lib/types"

export default function SavedEventsPage() {
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)
  const [savedEventIds, setSavedEventIds] = useState<string[]>(
    mockUser.savedEvents.map((e) => e.eventId)
  )

  const unreadCount = notifications.filter((n) => !n.read).length
  const savedEvents = mockEvents.filter((e) => savedEventIds.includes(e.id))

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const handleRemoveEvent = (eventId: string) => {
    setSavedEventIds((prev) => prev.filter((id) => id !== eventId))
  }

  const getMagnitudeDisplay = (event: NaturalEvent) => {
    switch (event.type) {
      case "earthquake":
        return `Magnitude ${event.magnitude?.toFixed(1)}`
      case "hurricane":
        return `Category ${event.category} - ${event.windSpeed} mph`
      case "wildfire":
        return `${event.acres?.toLocaleString()} acres`
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        isAuthenticated={true}
        user={mockUser}
        notifications={notifications}
        unreadCount={unreadCount}
        onLoginClick={() => {}}
        onLogoutClick={() => {}}
        onEmergencyClick={() => setShowEmergencyContacts(true)}
        onNotificationsClick={() => setShowNotifications(true)}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Bookmark className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Saved Events</h1>
        </div>

        {savedEvents.length === 0 ? (
          <Card className="p-12 text-center bg-card border-border">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">No saved events</h2>
            <p className="text-muted-foreground mb-6">
              Save events from the map to track them here
            </p>
            <Button asChild>
              <Link href="/">Browse Events</Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {savedEvents.map((event) => (
              <Card key={event.id} className="p-4 bg-card border-border">
                <div className="flex items-start gap-4">
                  <EventIcon type={event.type} alertLevel={event.alertLevel} size="lg" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{event.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <AlertBadge level={event.alertLevel} />
                          <span className="text-xs text-muted-foreground capitalize">
                            {event.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-primary">
                          {getMagnitudeDisplay(event)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-1" asChild>
                          <Link href={`/?event=${event.id}`}>
                            <ExternalLink className="w-3 h-3" />
                            View
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive gap-1"
                          onClick={() => handleRemoveEvent(event.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <EmergencyContacts
        contacts={emergencyContacts}
        isOpen={showEmergencyContacts}
        onClose={() => setShowEmergencyContacts(false)}
      />

      <NotificationsPanel
        notifications={notifications}
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onMarkRead={handleMarkNotificationRead}
        onEventClick={() => setShowNotifications(false)}
      />
    </div>
  )
}
