"use client"

import type { EventType, AlertLevel } from "@/lib/types"

interface EventIconProps {
  type: EventType
  alertLevel: AlertLevel
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
}

const alertColors = {
  critical: "text-alert-critical",
  warning: "text-alert-warning",
  moderate: "text-alert-moderate",
  low: "text-alert-low",
}

const bgColors = {
  critical: "bg-alert-critical/20",
  warning: "bg-alert-warning/20",
  moderate: "bg-alert-moderate/20",
  low: "bg-alert-low/20",
}

export function EarthquakeIcon({ alertLevel, size = "md", className = "" }: Omit<EventIconProps, "type">) {
  return (
    <div className={`${sizeClasses[size]} ${bgColors[alertLevel]} rounded-full flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-1/2 h-1/2 ${alertColors[alertLevel]}`}
      >
        <path d="M2 12h4l3-9 4 18 3-9h6" />
      </svg>
    </div>
  )
}

export function HurricaneIcon({ alertLevel, size = "md", className = "" }: Omit<EventIconProps, "type">) {
  return (
    <div className={`${sizeClasses[size]} ${bgColors[alertLevel]} rounded-full flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-1/2 h-1/2 ${alertColors[alertLevel]}`}
      >
        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        <path d="M12 12l0 -8" />
        <path d="M12 12l5.7 -5.7" />
        <path d="M12 12l8 0" />
        <path d="M12 12l5.7 5.7" />
        <path d="M12 12l0 8" />
        <path d="M12 12l-5.7 5.7" />
        <path d="M12 12l-8 0" />
        <path d="M12 12l-5.7 -5.7" />
      </svg>
    </div>
  )
}

export function WildfireIcon({ alertLevel, size = "md", className = "" }: Omit<EventIconProps, "type">) {
  return (
    <div className={`${sizeClasses[size]} ${bgColors[alertLevel]} rounded-full flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-1/2 h-1/2 ${alertColors[alertLevel]}`}
      >
        <path d="M12 12c2-2.96 0-7-1-8 0 3.038-1.773 4.741-3 6-1.226 1.26-2 3.24-2 5a6 6 0 1 0 12 0c0-1.532-1.056-3.94-2-5-1.786 3-2.791 3-4 2z" />
      </svg>
    </div>
  )
}

export function EventIcon({ type, alertLevel, size = "md", className = "" }: EventIconProps) {
  switch (type) {
    case "earthquake":
      return <EarthquakeIcon alertLevel={alertLevel} size={size} className={className} />
    case "hurricane":
      return <HurricaneIcon alertLevel={alertLevel} size={size} className={className} />
    case "wildfire":
      return <WildfireIcon alertLevel={alertLevel} size={size} className={className} />
    default:
      return null
  }
}

export function AlertBadge({ level }: { level: AlertLevel }) {
  const colors = {
    critical: "bg-alert-critical text-foreground",
    warning: "bg-alert-warning text-background",
    moderate: "bg-alert-moderate text-background",
    low: "bg-alert-low text-foreground",
  }

  const labels = {
    critical: "Critical",
    warning: "Warning",
    moderate: "Moderate",
    low: "Low",
  }

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide ${colors[level]}`}>
      {labels[level]}
    </span>
  )
}
