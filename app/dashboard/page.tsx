"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow, format } from "date-fns"
import {
  Bell,
  Bookmark,
  MapPin,
  Settings,
  TrendingUp,
  AlertTriangle,
  Shield,
  ChevronRight,
  Clock,
  Activity,
} from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { EventIcon, AlertBadge } from "@/components/event-icons"
import { EmergencyContacts } from "@/components/emergency-contacts"
import { NotificationsPanel } from "@/components/notifications-panel"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  mockEvents,
  mockNotifications,
  mockUser,
  mockZones,
  emergencyContacts,
  preventionRecommendations,
} from "@/lib/mock-data"
import { useAuth } from "@/hooks/use-auth"
import type { EventType } from "@/lib/types"

export default function DashboardPage() {
  const { user } = useAuth()
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length
  const savedEvents = mockEvents.filter((e) =>
    mockUser.savedEvents.some((saved) => saved.eventId === e.id)
  )

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  // Get active critical/warning events
  const criticalEvents = mockEvents.filter(
    (e) => e.alertLevel === "critical" || e.alertLevel === "warning"
  )

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        isAuthenticated={!!user}
        user={user}
        notifications={notifications}
        unreadCount={unreadCount}
        onLoginClick={() => {}}
        onLogoutClick={() => {}}
        onEmergencyClick={() => setShowEmergencyContacts(true)}
        onNotificationsClick={() => setShowNotifications(true)}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome back, {mockUser.name.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground">
            {"Here's"} an overview of current natural events and your alerts.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-alert-critical/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-alert-critical" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockEvents.filter((e) => e.alertLevel === "critical").length}
                </p>
                <p className="text-xs text-muted-foreground">Critical Alerts</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-alert-warning/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-alert-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockEvents.filter((e) => e.status === "active").length}
                </p>
                <p className="text-xs text-muted-foreground">Active Events</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockZones.length}</p>
                <p className="text-xs text-muted-foreground">Monitored Zones</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Bookmark className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{savedEvents.length}</p>
                <p className="text-xs text-muted-foreground">Saved Events</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Critical Events Alert */}
            {criticalEvents.length > 0 && (
              <Card className="p-4 bg-alert-critical/5 border-alert-critical/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-alert-critical/20 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-alert-critical" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      Active Critical Alerts
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {criticalEvents.length} event(s) requiring immediate attention
                    </p>
                    <div className="space-y-2">
                      {criticalEvents.slice(0, 3).map((event) => (
                        <Link
                          key={event.id}
                          href={`/?event=${event.id}`}
                          className="flex items-center gap-3 p-2 rounded-lg bg-card hover:bg-secondary transition-colors"
                        >
                          <EventIcon type={event.type} alertLevel={event.alertLevel} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {event.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{event.location}</p>
                          </div>
                          <AlertBadge level={event.alertLevel} />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Recent Activity / History */}
            <Card className="bg-card border-border">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <h2 className="font-semibold text-foreground">Activity History</h2>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/history">View all</Link>
                </Button>
              </div>
              <div className="divide-y divide-border">
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="p-4 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <Activity className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{notification.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {format(notification.timestamp, "MMM d, yyyy")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(notification.timestamp, "h:mm a")}
                        </span>
                      </div>
                    </div>
                    <AlertBadge level={notification.alertLevel} />
                  </div>
                ))}
              </div>
            </Card>

            {/* Saved Events */}
            <Card className="bg-card border-border">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-muted-foreground" />
                  <h2 className="font-semibold text-foreground">Saved Events</h2>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/saved">View all</Link>
                </Button>
              </div>
              {savedEvents.length > 0 ? (
                <div className="divide-y divide-border">
                  {savedEvents.map((event) => (
                    <Link
                      key={event.id}
                      href={`/?event=${event.id}`}
                      className="flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors"
                    >
                      <EventIcon type={event.type} alertLevel={event.alertLevel} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {event.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{event.location}</p>
                      </div>
                      <div className="text-right">
                        <AlertBadge level={event.alertLevel} />
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bookmark className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No saved events yet</p>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Zones of Interest */}
            <Card className="bg-card border-border">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <h2 className="font-semibold text-foreground">Monitored Zones</h2>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/settings">
                    <Settings className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
              <div className="divide-y divide-border">
                {mockZones.map((zone) => (
                  <div key={zone.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-medium text-foreground">{zone.name}</h3>
                      <span className="text-xs text-muted-foreground">{zone.radius}km</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {zone.notifyForTypes.map((type) => (
                        <span
                          key={type}
                          className="text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground capitalize"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/settings">Add Zone</Link>
                </Button>
              </div>
            </Card>

            {/* Prevention Recommendations */}
            <Card className="bg-card border-border">
              <div className="p-4 border-b border-border flex items-center gap-2">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <h2 className="font-semibold text-foreground">Prevention Tips</h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {(Object.keys(preventionRecommendations) as EventType[]).map((type) => (
                    <div key={type}>
                      <h4 className="text-xs font-medium text-primary uppercase tracking-wide mb-2 capitalize">
                        {type}
                      </h4>
                      <ul className="space-y-1">
                        {preventionRecommendations[type].slice(0, 2).map((tip, index) => (
                          <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-card border-border p-4">
              <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
                  <Link href="/">
                    <MapPin className="w-4 h-4" />
                    View Live Map
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
                  <Link href="/settings">
                    <Settings className="w-4 h-4" />
                    Manage Settings
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => setShowNotifications(true)}
                >
                  <Bell className="w-4 h-4" />
                  View Notifications
                </Button>
              </div>
            </Card>
          </div>
        </div>
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
