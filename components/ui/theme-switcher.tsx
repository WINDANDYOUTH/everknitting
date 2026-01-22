"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Monitor } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Three-state theme switcher: Light / Dark / System
 * Follows grayscale minimalist design system
 */
export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return placeholder with same dimensions to prevent layout shift
    return (
      <div 
        className={cn(
          "flex items-center gap-1 rounded-sm border border-border bg-muted/50 p-1",
          className
        )}
        aria-hidden="true"
      >
        <div className="size-8 rounded-sm" />
        <div className="size-8 rounded-sm" />
        <div className="size-8 rounded-sm" />
      </div>
    )
  }

  const options = [
    { value: "light", icon: Sun, label: "Light mode" },
    { value: "dark", icon: Moon, label: "Dark mode" },
    { value: "system", icon: Monitor, label: "System theme" },
  ] as const

  return (
    <div
      role="radiogroup"
      aria-label="Theme selection"
      className={cn(
        "flex items-center gap-1 rounded-sm border border-border bg-muted/50 p-1",
        className
      )}
    >
      {options.map(({ value, icon: Icon, label }) => {
        const isActive = theme === value
        
        return (
          <button
            key={value}
            role="radio"
            aria-checked={isActive}
            aria-label={label}
            onClick={() => setTheme(value)}
            className={cn(
              "relative flex size-8 items-center justify-center rounded-sm transition-all",
              "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive && "bg-background shadow-sm"
            )}
          >
            <Icon 
              className={cn(
                "size-4 transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground"
              )} 
            />
          </button>
        )
      })}
    </div>
  )
}

/**
 * Minimal theme toggle button (cycles through themes)
 * For use in compact spaces like mobile header
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className={cn(
          "flex size-9 items-center justify-center rounded-sm border border-border",
          className
        )}
        aria-hidden="true"
      >
        <div className="size-4" />
      </button>
    )
  }

  // Cycle: light -> dark -> system -> light
  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor
  const label = theme === "light" ? "Light mode" : theme === "dark" ? "Dark mode" : "System theme"

  return (
    <button
      onClick={cycleTheme}
      aria-label={`Current: ${label}. Click to change.`}
      className={cn(
        "flex size-9 items-center justify-center rounded-sm border border-border",
        "transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <Icon className="size-4 text-foreground" />
    </button>
  )
}
