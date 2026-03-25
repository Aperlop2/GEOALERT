export type EventType = "earthquake" | "hurricane" | "wildfire"

export type AlertLevel = "critical" | "warning" | "moderate" | "low"

export interface NaturalEvent {
  id: string
  type: EventType
  name: string
  location: string
  coordinates: {
    lat: number
    lng: number
  }
  magnitude?: number // For earthquakes (Richter scale)
  category?: number // For hurricanes (1-5)
  acres?: number // For wildfires
  windSpeed?: number // For hurricanes (mph)
  alertLevel: AlertLevel
  timestamp: Date
  description: string
  affectedArea: string
  casualties?: number
  evacuations?: number
  status: "active" | "monitoring" | "resolved"
}

export interface Notification {
  id: string
  eventId: string
  type: "alert_increase" | "new_event" | "status_change" | "recommendation"
  title: string
  message: string
  timestamp: Date
  read: boolean
  alertLevel: AlertLevel
}

export interface SavedEvent {
  id: string
  eventId: string
  savedAt: Date
  notes?: string
}

export interface ZoneOfInterest {
  id: string
  name: string
  coordinates: {
    lat: number
    lng: number
  }
  radius: number // in km
  notifyForTypes: EventType[]
  notifyForAlertLevels: AlertLevel[]
}

export interface EmergencyContact {
  id: string
  name: string
  phone: string
  type: "emergency" | "government" | "medical" | "rescue"
  country: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  zones: ZoneOfInterest[]
  savedEvents: SavedEvent[]
  preferences: {
    notifications: boolean
    emailAlerts: boolean
    smsAlerts: boolean
  }
}
