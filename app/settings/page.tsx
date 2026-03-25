"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Bell,
  MapPin,
  Shield,
  User,
  Mail,
  Phone,
  Trash2,
  Plus,
  ChevronLeft,
  Save,
} from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { EmergencyContacts } from "@/components/emergency-contacts"
import { NotificationsPanel } from "@/components/notifications-panel"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { mockUser, mockZones, emergencyContacts, mockNotifications } from "@/lib/mock-data"
import type { EventType, AlertLevel, ZoneOfInterest } from "@/lib/types"

export default function SettingsPage() {
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)
  const [zones, setZones] = useState<ZoneOfInterest[]>(mockZones)
  const [preferences, setPreferences] = useState(mockUser.preferences)
  const [showAddZone, setShowAddZone] = useState(false)
  const [newZone, setNewZone] = useState({
    name: "",
    radius: 100,
    notifyForTypes: [] as EventType[],
    notifyForAlertLevels: [] as AlertLevel[],
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const handleDeleteZone = (id: string) => {
    setZones((prev) => prev.filter((z) => z.id !== id))
  }

  const handleAddZone = () => {
    if (!newZone.name) return

    const zone: ZoneOfInterest = {
      id: `zone-${Date.now()}`,
      name: newZone.name,
      coordinates: { lat: 37.7749, lng: -122.4194 }, // Default to SF
      radius: newZone.radius,
      notifyForTypes: newZone.notifyForTypes,
      notifyForAlertLevels: newZone.notifyForAlertLevels,
    }

    setZones((prev) => [...prev, zone])
    setNewZone({
      name: "",
      radius: 100,
      notifyForTypes: [],
      notifyForAlertLevels: [],
    })
    setShowAddZone(false)
  }

  const toggleZoneType = (type: EventType) => {
    setNewZone((prev) => ({
      ...prev,
      notifyForTypes: prev.notifyForTypes.includes(type)
        ? prev.notifyForTypes.filter((t) => t !== type)
        : [...prev.notifyForTypes, type],
    }))
  }

  const toggleZoneLevel = (level: AlertLevel) => {
    setNewZone((prev) => ({
      ...prev,
      notifyForAlertLevels: prev.notifyForAlertLevels.includes(level)
        ? prev.notifyForAlertLevels.filter((l) => l !== level)
        : [...prev.notifyForAlertLevels, level],
    }))
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

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-8">Settings</h1>

        <div className="space-y-8">
          {/* Profile Section */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Profile</h2>
            </div>

            <FieldGroup>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input defaultValue={mockUser.name} />
              </Field>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input type="email" defaultValue={mockUser.email} />
              </Field>
            </FieldGroup>

            <Button className="mt-4 gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </Card>

          {/* Notification Preferences */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">
                    Receive real-time alerts in your browser
                  </p>
                </div>
                <Switch
                  checked={preferences.notifications}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({ ...prev, notifications: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Email Alerts</p>
                    <p className="text-xs text-muted-foreground">
                      Receive alerts via email
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.emailAlerts}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({ ...prev, emailAlerts: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">SMS Alerts</p>
                    <p className="text-xs text-muted-foreground">
                      Receive critical alerts via SMS
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.smsAlerts}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({ ...prev, smsAlerts: checked }))
                  }
                />
              </div>
            </div>
          </Card>

          {/* Zones of Interest */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-foreground">Zones of Interest</h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => setShowAddZone(!showAddZone)}
              >
                <Plus className="w-4 h-4" />
                Add Zone
              </Button>
            </div>

            {/* Add Zone Form */}
            {showAddZone && (
              <Card className="p-4 bg-secondary border-border mb-4">
                <h3 className="text-sm font-medium text-foreground mb-4">New Zone</h3>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Zone Name</FieldLabel>
                    <Input
                      placeholder="e.g., Home, Office, Family"
                      value={newZone.name}
                      onChange={(e) =>
                        setNewZone((prev) => ({ ...prev, name: e.target.value }))
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Radius (km)</FieldLabel>
                    <Input
                      type="number"
                      value={newZone.radius}
                      onChange={(e) =>
                        setNewZone((prev) => ({
                          ...prev,
                          radius: parseInt(e.target.value) || 100,
                        }))
                      }
                    />
                  </Field>
                </FieldGroup>

                <div className="mt-4">
                  <p className="text-sm font-medium text-foreground mb-2">Event Types</p>
                  <div className="flex flex-wrap gap-2">
                    {(["earthquake", "hurricane", "wildfire"] as EventType[]).map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={newZone.notifyForTypes.includes(type)}
                          onCheckedChange={() => toggleZoneType(type)}
                        />
                        <span className="text-sm text-foreground capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-foreground mb-2">Alert Levels</p>
                  <div className="flex flex-wrap gap-2">
                    {(["critical", "warning", "moderate", "low"] as AlertLevel[]).map((level) => (
                      <label key={level} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={newZone.notifyForAlertLevels.includes(level)}
                          onCheckedChange={() => toggleZoneLevel(level)}
                        />
                        <span className="text-sm text-foreground capitalize">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" onClick={handleAddZone}>
                    Add Zone
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAddZone(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            )}

            {/* Existing Zones */}
            <div className="space-y-3">
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className="flex items-start justify-between p-4 rounded-lg bg-secondary"
                >
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{zone.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Radius: {zone.radius}km
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {zone.notifyForTypes.map((type) => (
                        <span
                          key={type}
                          className="text-xs px-2 py-0.5 rounded bg-card text-muted-foreground capitalize"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteZone(zone.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Alert Level Management */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Alert Level Management</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-alert-critical/10 border border-alert-critical/20">
                <div>
                  <p className="text-sm font-medium text-foreground">Critical Alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Immediate danger, evacuations required
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-alert-warning/10 border border-alert-warning/20">
                <div>
                  <p className="text-sm font-medium text-foreground">Warning Alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Potential danger, stay prepared
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-alert-moderate/10 border border-alert-moderate/20">
                <div>
                  <p className="text-sm font-medium text-foreground">Moderate Alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Advisory level, be aware
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-alert-low/10 border border-alert-low/20">
                <div>
                  <p className="text-sm font-medium text-foreground">Low Alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Informational only
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>
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
