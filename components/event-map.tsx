"use client"

import { useState, useCallback } from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps"
import type { NaturalEvent, EventType, AlertLevel } from "@/lib/types"
import { EventIcon } from "./event-icons"

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

interface EventMapProps {
  events: NaturalEvent[]
  selectedEvent: NaturalEvent | null
  onEventSelect: (event: NaturalEvent) => void
  filters: {
    types: EventType[]
    alertLevels: AlertLevel[]
  }
}

export function EventMap({ events, selectedEvent, onEventSelect, filters }: EventMapProps) {
  const [position, setPosition] = useState({ coordinates: [-95, 38] as [number, number], zoom: 1 })

  const handleMoveEnd = useCallback((position: { coordinates: [number, number]; zoom: number }) => {
    setPosition(position)
  }, [])

  const filteredEvents = events.filter((event) => {
    const typeMatch = filters.types.length === 0 || filters.types.includes(event.type)
    const levelMatch = filters.alertLevels.length === 0 || filters.alertLevels.includes(event.alertLevel)
    return typeMatch && levelMatch
  })

  const getMarkerSize = (alertLevel: AlertLevel) => {
    switch (alertLevel) {
      case "critical":
        return 24
      case "warning":
        return 20
      case "moderate":
        return 16
      case "low":
        return 14
      default:
        return 16
    }
  }

  return (
    <div className="w-full h-full bg-background rounded-lg overflow-hidden relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 150,
        }}
        className="w-full h-full"
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
          minZoom={1}
          maxZoom={8}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#1a1a2e"
                  stroke="#2d2d44"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#252542", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {filteredEvents.map((event) => {
            const isSelected = selectedEvent?.id === event.id
            const size = getMarkerSize(event.alertLevel)

            return (
              <Marker
                key={event.id}
                coordinates={[event.coordinates.lng, event.coordinates.lat]}
                onClick={() => onEventSelect(event)}
              >
                <g
                  className={`cursor-pointer transition-transform ${isSelected ? "scale-125" : "hover:scale-110"}`}
                  transform={`translate(${-size / 2}, ${-size / 2})`}
                >
                  <foreignObject width={size} height={size}>
                    <EventIcon
                      type={event.type}
                      alertLevel={event.alertLevel}
                      size="md"
                    />
                  </foreignObject>
                </g>
                {isSelected && (
                  <circle
                    r={size / 2 + 6}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="text-primary animate-pulse"
                  />
                )}
              </Marker>
            )
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1">
        <button
          onClick={() => setPosition((pos) => ({ ...pos, zoom: Math.min(pos.zoom * 1.5, 8) }))}
          className="w-8 h-8 bg-card border border-border rounded flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          onClick={() => setPosition((pos) => ({ ...pos, zoom: Math.max(pos.zoom / 1.5, 1) }))}
          className="w-8 h-8 bg-card border border-border rounded flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3">
        <h4 className="text-xs font-medium text-muted-foreground mb-2">Event Types</h4>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs">
            <EventIcon type="earthquake" alertLevel="moderate" size="sm" />
            <span className="text-foreground">Earthquake</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <EventIcon type="hurricane" alertLevel="moderate" size="sm" />
            <span className="text-foreground">Hurricane</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <EventIcon type="wildfire" alertLevel="moderate" size="sm" />
            <span className="text-foreground">Wildfire</span>
          </div>
        </div>
      </div>
    </div>
  )
}
