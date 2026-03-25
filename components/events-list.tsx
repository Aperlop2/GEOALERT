"use client"

import { formatDistanceToNow } from "date-fns"
import { MapPin } from "lucide-react"
import type { NaturalEvent, EventType, AlertLevel } from "@/lib/types"
import { EventIcon, AlertBadge } from "./event-icons"
import { cn } from "@/lib/utils"

interface EventsListProps {
  events: NaturalEvent[]
  selectedEvent: NaturalEvent | null
  onEventSelect: (event: NaturalEvent) => void
  filters: {
    types: EventType[]
    alertLevels: AlertLevel[]
  }
}

export function EventsList({ events, selectedEvent, onEventSelect, filters }: EventsListProps) {
  const filteredEvents = events.filter((event) => {
    const typeMatch = filters.types.length === 0 || filters.types.includes(event.type)
    const levelMatch = filters.alertLevels.length === 0 || filters.alertLevels.includes(event.alertLevel)
    return typeMatch && levelMatch
  })

  // Sort by alert level priority and then by timestamp
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const levelPriority = { critical: 0, warning: 1, moderate: 2, low: 3 }
    const levelDiff = levelPriority[a.alertLevel] - levelPriority[b.alertLevel]
    if (levelDiff !== 0) return levelDiff
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  const getMagnitudeDisplay = (event: NaturalEvent) => {
    switch (event.type) {
      case "earthquake":
        return `M${event.magnitude?.toFixed(1)}`
      case "hurricane":
        return `Cat ${event.category}`
      case "wildfire":
        return `${event.acres?.toLocaleString()} acres`
      default:
        return ""
    }
  }

  if (sortedEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center p-4">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-3">
          <MapPin className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-medium text-foreground mb-1">No events found</h3>
        <p className="text-xs text-muted-foreground">
          Try adjusting your filters to see more events
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {sortedEvents.map((event) => (
        <button
          key={event.id}
          onClick={() => onEventSelect(event)}
          className={cn(
            "flex items-start gap-3 p-4 text-left transition-colors hover:bg-secondary/50",
            selectedEvent?.id === event.id && "bg-secondary"
          )}
        >
          <EventIcon type={event.type} alertLevel={event.alertLevel} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-medium text-foreground truncate">{event.name}</h3>
              <AlertBadge level={event.alertLevel} />
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-medium text-primary">{getMagnitudeDisplay(event)}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(event.timestamp, { addSuffix: true })}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
