"use client"

import { GlowingShadow } from "@/components/ui/glowing-shadow"
import { ParticleButton } from "@/components/ui/particle-button"
import { Dock } from "@/components/ui/dock"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4 space-y-16">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-display font-bold text-foreground">UI Component Demo</h1>
          <p className="text-muted-foreground text-sm">
            Glowing Shadow, Particle Button, and Dock components
          </p>
        </div>

        {/* Glowing Shadow */}
        <section className="space-y-4">
          <h2 className="text-xl font-display text-foreground border-b border-border pb-2">
            Glowing Shadow
          </h2>
          <div className="flex items-center justify-center py-8">
            <GlowingShadow>
              <div className="text-center text-white p-8 max-w-xs">
                <p className="text-lg font-bold mb-2">Glow Container</p>
                <p className="text-sm opacity-80">
                  Content inside the glow boundary. The card color and
                  border-width are driven by CSS custom properties.
                </p>
              </div>
            </GlowingShadow>
          </div>
        </section>

        {/* Particle Button */}
        <section className="space-y-4">
          <h2 className="text-xl font-display text-foreground border-b border-border pb-2">
            Particle Button
          </h2>
          <div className="flex items-center justify-center py-8 gap-4">
            <ParticleButton />
            <ParticleButton className="bg-chart-2 border-chart-2/60 hover:bg-chart-2/90">
              Custom Action
            </ParticleButton>
          </div>
        </section>

        {/* Dock */}
        <section className="space-y-4">
          <h2 className="text-xl font-display text-foreground border-b border-border pb-2">
            Dock Navigation
          </h2>
          <div className="flex items-center justify-center py-8">
            <TooltipProvider>
              <Dock />
            </TooltipProvider>
          </div>
        </section>
      </div>
    </div>
  )
}
