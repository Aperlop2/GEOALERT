"use client"

import { useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { AppHeader } from "@/components/app-header"
import { EventsList } from "@/components/events-list"
import { EventDetailPanel } from "@/components/event-detail-panel"
import { FiltersPanel } from "@/components/filters-panel"
import { EmergencyContacts } from "@/components/emergency-contacts"
import { LoginModal } from "@/components/login-modal"
import { NotificationsPanel } from "@/components/notifications-panel"
import { ChatAssistant, ChatButton } from "@/components/chat-assistant"
import { Button } from "@/components/ui/button"
import { List, Map as MapIcon, X } from "lucide-react"
import { mockEvents, emergencyContacts, mockNotifications, mockUser } from "@/lib/mock-data"
import type { NaturalEvent, EventType, AlertLevel } from "@/lib/types"
import { useAuth } from "@/hooks/use-auth"
import type { User as FirebaseUser } from "firebase/auth"

// Dynamically import the map to avoid SSR issues
const EventMap = dynamic(() => import("@/components/event-map").then((mod) => mod.EventMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading map...</div>
    </div>
  ),
})

export default function HomePage() {
  const { user, logout } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Crear usuario real basado en Firebase Auth
  const currentUser = user ? {
    id: user.uid,
    name: user.displayName || user.email?.split('@')[0] || 'Usuario',
    email: user.email || '',
    avatar: user.photoURL || undefined,
    zones: mockUser.zones, // Mantener zonas del mock por ahora
    savedEvents: mockUser.savedEvents, // Mantener eventos guardados del mock por ahora
    preferences: mockUser.preferences, // Mantener preferencias del mock por ahora
  } : null

  // Event state
  const [selectedEvent, setSelectedEvent] = useState<NaturalEvent | null>(null)
  const [savedEventIds, setSavedEventIds] = useState<string[]>(
    currentUser?.savedEvents?.map((e) => e.eventId) || mockUser.savedEvents.map((e) => e.eventId)
  )

  // Filter state
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>([])
  const [selectedLevels, setSelectedLevels] = useState<AlertLevel[]>([])

  // UI state
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMobileList, setShowMobileList] = useState(false)
  const [showChat, setShowChat] = useState(false)

  // Notifications
  const [notifications, setNotifications] = useState(mockNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  const handleEventSelect = useCallback((event: NaturalEvent) => {
    setSelectedEvent(event)
    setShowMobileList(false)
  }, [])

  const handleSaveEvent = useCallback((event: NaturalEvent) => {
    setSavedEventIds((prev) =>
      prev.includes(event.id)
        ? prev.filter((id) => id !== event.id)
        : [...prev, event.id]
    )
  }, [])

  const handleLogin = useCallback(() => {
    setShowLoginModal(false)
  }, [])

  const handleLogout = useCallback(async () => {
    await logout()
  }, [logout])

  const handleMarkNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const filters = {
    types: selectedTypes,
    alertLevels: selectedLevels,
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <AppHeader
        isAuthenticated={!!user}
        user={currentUser}
        notifications={notifications}
        unreadCount={unreadCount}
        onLoginClick={() => setShowLoginModal(true)}
        onLogoutClick={handleLogout}
        onEmergencyClick={() => setShowEmergencyContacts(true)}
        onNotificationsClick={() => setShowNotifications(true)}
      />

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar - Events List (Desktop) */}
        <aside className="hidden lg:flex w-80 xl:w-96 border-r border-border flex-col bg-card">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Active Events</h2>
            <FiltersPanel
              selectedTypes={selectedTypes}
              selectedLevels={selectedLevels}
              onTypesChange={setSelectedTypes}
              onLevelsChange={setSelectedLevels}
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            <EventsList
              events={mockEvents}
              selectedEvent={selectedEvent}
              onEventSelect={handleEventSelect}
              filters={filters}
            />
          </div>
        </aside>

        {/* Main Content - Map */}
        <div className="flex-1 relative">
          <EventMap
            events={mockEvents}
            selectedEvent={selectedEvent}
            onEventSelect={handleEventSelect}
            filters={filters}
          />

          {/* Mobile Filter Button */}
          <div className="absolute top-4 right-4 lg:hidden flex gap-2">
            <FiltersPanel
              selectedTypes={selectedTypes}
              selectedLevels={selectedLevels}
              onTypesChange={setSelectedTypes}
              onLevelsChange={setSelectedLevels}
            />
          </div>

          {/* Mobile Toggle Button */}
          <Button
            variant="default"
            size="icon"
            className="absolute bottom-4 left-4 lg:hidden w-12 h-12 rounded-full shadow-lg"
            onClick={() => setShowMobileList(!showMobileList)}
          >
            {showMobileList ? <MapIcon className="w-5 h-5" /> : <List className="w-5 h-5" />}
          </Button>

          {/* Mobile Events List */}
          {showMobileList && (
            <div className="absolute inset-0 bg-card lg:hidden z-10 flex flex-col">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Active Events</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowMobileList(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <EventsList
                  events={mockEvents}
                  selectedEvent={selectedEvent}
                  onEventSelect={handleEventSelect}
                  filters={filters}
                />
              </div>
            </div>
          )}
        </div>

        {/* Event Detail Panel */}
        {selectedEvent && (
          <aside className="hidden md:block w-80 xl:w-96">
            <EventDetailPanel
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
              onSave={handleSaveEvent}
              isSaved={savedEventIds.includes(selectedEvent.id)}
              isAuthenticated={!!user}
            />
          </aside>
        )}

        {/* Mobile Event Detail */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-card z-20 md:hidden">
            <EventDetailPanel
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
              onSave={handleSaveEvent}
              isSaved={savedEventIds.includes(selectedEvent.id)}
              isAuthenticated={!!user}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <EmergencyContacts
        contacts={emergencyContacts}
        isOpen={showEmergencyContacts}
        onClose={() => setShowEmergencyContacts(false)}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {!!user && (
        <NotificationsPanel
          notifications={notifications}
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          onMarkRead={handleMarkNotificationRead}
          onEventClick={(eventId) => {
            const event = mockEvents.find((e) => e.id === eventId)
            if (event) {
              setSelectedEvent(event)
              setShowNotifications(false)
            }
          }}
        />
      )}

      {/* Chat Assistant */}
      {!!user && (
        <>
          {!showChat && <ChatButton onClick={() => setShowChat(true)} />}
          <ChatAssistant isOpen={showChat} onClose={() => setShowChat(false)} />
        </>
      )}
    </div>
  )
}
