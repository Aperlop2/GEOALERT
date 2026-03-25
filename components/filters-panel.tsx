"use client"

import { useState } from "react"
import { Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { EventType, AlertLevel } from "@/lib/types"
import { EventIcon, AlertBadge } from "./event-icons"

interface FiltersPanelProps {
  selectedTypes: EventType[]
  selectedLevels: AlertLevel[]
  onTypesChange: (types: EventType[]) => void
  onLevelsChange: (levels: AlertLevel[]) => void
}

const eventTypes: { type: EventType; label: string }[] = [
  { type: "earthquake", label: "Earthquakes" },
  { type: "hurricane", label: "Hurricanes" },
  { type: "wildfire", label: "Wildfires" },
]

const alertLevels: { level: AlertLevel; label: string }[] = [
  { level: "critical", label: "Critical" },
  { level: "warning", label: "Warning" },
  { level: "moderate", label: "Moderate" },
  { level: "low", label: "Low" },
]

export function FiltersPanel({
  selectedTypes,
  selectedLevels,
  onTypesChange,
  onLevelsChange,
}: FiltersPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleType = (type: EventType) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type))
    } else {
      onTypesChange([...selectedTypes, type])
    }
  }

  const toggleLevel = (level: AlertLevel) => {
    if (selectedLevels.includes(level)) {
      onLevelsChange(selectedLevels.filter((l) => l !== level))
    } else {
      onLevelsChange([...selectedLevels, level])
    }
  }

  const clearFilters = () => {
    onTypesChange([])
    onLevelsChange([])
  }

  const activeFiltersCount = selectedTypes.length + selectedLevels.length

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-4">
        <div className="space-y-4">
          {/* Event Types */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Event Type</h4>
            <div className="space-y-2">
              {eventTypes.map(({ type, label }) => (
                <label
                  key={type}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-secondary transition-colors"
                >
                  <Checkbox
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={() => toggleType(type)}
                  />
                  <EventIcon type={type} alertLevel="moderate" size="sm" />
                  <span className="text-sm text-foreground">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Alert Levels */}
          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Alert Level</h4>
            <div className="space-y-2">
              {alertLevels.map(({ level, label }) => (
                <label
                  key={level}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-secondary transition-colors"
                >
                  <Checkbox
                    checked={selectedLevels.includes(level)}
                    onCheckedChange={() => toggleLevel(level)}
                  />
                  <AlertBadge level={level} />
                </label>
              ))}
            </div>
          </div>

          {/* Clear Button */}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={clearFilters}
            >
              Clear all filters
            </Button>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
