"use client"

import { X, Share2, Bookmark, MapPin, Clock, Users, AlertTriangle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { NaturalEvent } from "@/lib/types"
import { EventIcon, AlertBadge } from "./event-icons"
import { formatDistanceToNow } from "date-fns"

interface EventDetailPanelProps {
  event: NaturalEvent | null
  onClose: () => void
  onSave?: (event: NaturalEvent) => void
  isSaved?: boolean
  isAuthenticated?: boolean
}

export function EventDetailPanel({
  event,
  onClose,
  onSave,
  isSaved = false,
  isAuthenticated = false,
}: EventDetailPanelProps) {
  if (!event) return null

  const handleShare = async () => {
    const shareData = {
      title: event.name,
      text: `${event.type.charAt(0).toUpperCase() + event.type.slice(1)} Alert: ${event.name} - ${event.location}`,
      url: `${window.location.origin}/event/${event.id}`,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log("Share cancelled")
      }
    } else {
      await navigator.clipboard.writeText(shareData.url)
      alert("Link copied to clipboard!")
    }
  }

  const getMagnitudeInfo = () => {
    switch (event.type) {
      case "earthquake":
        return { label: "Magnitude", value: event.magnitude?.toFixed(1) || "N/A", unit: "Richter" }
      case "hurricane":
        return { label: "Category", value: event.category?.toString() || "N/A", unit: `${event.windSpeed} mph` }
      case "wildfire":
        return { label: "Area", value: event.acres?.toLocaleString() || "N/A", unit: "acres" }
      default:
        return { label: "Magnitude", value: "N/A", unit: "" }
    }
  }

  const magnitudeInfo = getMagnitudeInfo()

  const statusColors = {
    active: "text-alert-critical",
    monitoring: "text-alert-warning",
    resolved: "text-alert-low",
  }

  return (
    <div className="w-full h-full bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-border">
        <div className="flex items-start gap-3">
          <EventIcon type={event.type} alertLevel={event.alertLevel} size="lg" />
          <div>
            <h2 className="text-lg font-semibold text-foreground text-balance">{event.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <AlertBadge level={event.alertLevel} />
              <span className={`text-xs font-medium capitalize ${statusColors[event.status]}`}>
                {event.status}
              </span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Location & Time */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-foreground">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-foreground">{formatDistanceToNow(event.timestamp, { addSuffix: true })}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3 bg-secondary border-border">
            <div className="text-xs text-muted-foreground">{magnitudeInfo.label}</div>
            <div className="text-xl font-bold text-foreground">{magnitudeInfo.value}</div>
            <div className="text-xs text-muted-foreground">{magnitudeInfo.unit}</div>
          </Card>

          {event.evacuations && (
            <Card className="p-3 bg-secondary border-border">
              <div className="text-xs text-muted-foreground">Evacuations</div>
              <div className="text-xl font-bold text-foreground">{event.evacuations.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">people</div>
            </Card>
          )}

          {event.casualties !== undefined && event.casualties > 0 && (
            <Card className="p-3 bg-alert-critical/10 border-alert-critical/30">
              <div className="text-xs text-alert-critical">Casualties</div>
              <div className="text-xl font-bold text-alert-critical">{event.casualties}</div>
              <div className="text-xs text-alert-critical">reported</div>
            </Card>
          )}
        </div>

        {/* Description */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">Description</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
        </div>

        {/* Affected Area */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">Affected Area</h3>
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-alert-warning mt-0.5" />
            <p className="text-sm text-muted-foreground">{event.affectedArea}</p>
          </div>
        </div>

        {/* Coordinates */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">Coordinates</h3>
          <p className="text-sm font-mono text-muted-foreground">
            {event.coordinates.lat.toFixed(4)}, {event.coordinates.lng.toFixed(4)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border flex gap-2">
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        {isAuthenticated && onSave && (
          <Button
            variant={isSaved ? "default" : "outline"}
            className="flex-1 gap-2"
            onClick={() => onSave(event)}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
            {isSaved ? "Saved" : "Save"}
          </Button>
        )}
        <Button variant="outline" size="icon" asChild>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${event.coordinates.lat},${event.coordinates.lng}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </div>
  )
}
