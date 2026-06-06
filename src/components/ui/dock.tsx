"use client"

import { useState } from "react"
import { motion } from "motion/react"
import {
  Crosshair,
  Radar,
  Bell,
  Settings,
  Shield,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface DockItem {
  id: string
  label: string
  icon: React.ReactNode
  onClick?: () => void
}

const defaultItems: DockItem[] = [
  { id: "home", label: "Home", icon: <Crosshair className="h-5 w-5" /> },
  { id: "search", label: "Search", icon: <Radar className="h-5 w-5" /> },
  { id: "notifications", label: "Notifications", icon: <Bell className="h-5 w-5" /> },
  { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  { id: "profile", label: "Profile", icon: <Shield className="h-5 w-5" /> },
]

interface DockProps {
  items?: DockItem[]
  className?: string
}

export function Dock({ items = defaultItems, className }: DockProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div
      className={cn(
        "flex items-end gap-2 px-4 py-3 rounded-[var(--radius)] border border-border bg-card/80 backdrop-blur-sm shadow-[var(--glow-soft)]",
        className
      )}
    >
      {items.map((item) => {
        const isActive = activeId === item.id
        const isHovered = hoveredId === item.id

        return (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <motion.button
                onClick={() => {
                  setActiveId(item.id)
                  item.onClick?.()
                }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={cn(
                  "relative flex items-center justify-center w-12 h-12 rounded-lg border transition-colors",
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
                animate={{
                  scale: isHovered ? 1.18 : 1,
                  y: isHovered ? -8 : 0,
                  transition: { type: "spring", stiffness: 400, damping: 20 },
                }}
                style={{
                  transformOrigin: "bottom center",
                }}
              >
                {item.icon}
                {isActive && (
                  <motion.span
                    layoutId="dock-active"
                    className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                )}
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              {item.label}
            </TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}
