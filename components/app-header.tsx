"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Phone, User, LogIn, Menu, X, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Notification, User as UserType } from "@/lib/types"

interface AppHeaderProps {
  isAuthenticated: boolean
  user?: UserType | null
  notifications?: Notification[]
  unreadCount?: number
  onLoginClick: () => void
  onLogoutClick: () => void
  onEmergencyClick: () => void
  onNotificationsClick?: () => void
}

export function AppHeader({
  isAuthenticated,
  user,
  unreadCount = 0,
  onLoginClick,
  onLogoutClick,
  onEmergencyClick,
  onNotificationsClick,
}: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
      {/* Logo & Brand */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5 text-primary-foreground"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-bold text-foreground hidden sm:inline">GeoAlert</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 ml-6">
          <Link
            href="/"
            className="px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-md transition-colors"
          >
            Map
          </Link>
          {isAuthenticated && (
            <>
              <Link
                href="/dashboard"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/saved"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
              >
                Saved
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Emergency Button */}
        <Button
          variant="destructive"
          size="sm"
          className="gap-2 hidden sm:flex"
          onClick={onEmergencyClick}
        >
          <Phone className="w-4 h-4" />
          <span className="hidden lg:inline">Emergency</span>
        </Button>

        {isAuthenticated ? (
          <>
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onNotificationsClick}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogoutClick} className="text-destructive cursor-pointer">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button variant="outline" size="sm" className="gap-2" onClick={onLoginClick}>
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Sign In</span>
          </Button>
        )}

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-card border-b border-border p-4 md:hidden z-50">
          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              className="px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Map
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/saved"
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Saved Events
                </Link>
              </>
            )}
            <Button
              variant="destructive"
              size="sm"
              className="gap-2 mt-2"
              onClick={() => {
                onEmergencyClick()
                setMobileMenuOpen(false)
              }}
            >
              <Phone className="w-4 h-4" />
              Emergency Contacts
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
