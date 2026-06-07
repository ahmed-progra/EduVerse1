"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MousePointerClick } from "lucide-react"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
}

interface ParticleButtonProps {
  onClick?: () => void
  className?: string
  children?: React.ReactNode
}

const PARTICLE_COLORS = [
  "var(--primary)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
]

export function ParticleButton({ onClick, className, children }: ParticleButtonProps) {
  const [particles, setParticles] = useState<Particle[]>(() => [])

  const handleClick = useCallback(() => {
    const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 120,
      y: (Math.random() - 0.5) * 120,
      size: Math.random() * 4 + 2,
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    }))
    const newIds = new Set(newParticles.map((p) => p.id))
    setParticles((prev) => [...prev, ...newParticles])
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newIds.has(p.id)))
    }, 600)
    onClick?.()
  }, [onClick])

  return (
    <div className="relative inline-flex">
      <Button onClick={handleClick} className={cn("relative", className)}>
        {children || (
          <>
            <MousePointerClick className="mr-2 h-4 w-4" />
            Click Me
          </>
        )}
      </Button>
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute pointer-events-none"
            style={{
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: p.color,
              top: "50%",
              left: "50%",
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
