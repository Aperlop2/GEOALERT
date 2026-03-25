"use client"

import { Phone, Building2, Stethoscope, LifeBuoy, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { EmergencyContact } from "@/lib/types"

interface EmergencyContactsProps {
  contacts: EmergencyContact[]
  isOpen: boolean
  onClose: () => void
}

const typeIcons = {
  emergency: Phone,
  government: Building2,
  medical: Stethoscope,
  rescue: LifeBuoy,
}

const typeColors = {
  emergency: "bg-alert-critical/10 text-alert-critical",
  government: "bg-alert-low/10 text-alert-low",
  medical: "bg-alert-moderate/10 text-alert-moderate",
  rescue: "bg-alert-warning/10 text-alert-warning",
}

export function EmergencyContacts({ contacts, isOpen, onClose }: EmergencyContactsProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Emergency Contacts</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {contacts.map((contact) => {
            const Icon = typeIcons[contact.type]
            return (
              <a
                key={contact.id}
                href={`tel:${contact.phone}`}
                className="flex items-center gap-4 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeColors[contact.type]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-foreground">{contact.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{contact.type}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-medium text-primary">{contact.phone}</span>
                </div>
              </a>
            )
          })}
        </div>
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            In case of emergency, always dial 911 first
          </p>
        </div>
      </Card>
    </div>
  )
}
