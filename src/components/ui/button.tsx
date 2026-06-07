"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] overflow-hidden relative",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-primary/60 hover:bg-primary/90 shadow-sm hover:shadow-md",
        destructive:
          "bg-destructive text-destructive-foreground border border-destructive/60 hover:bg-destructive/90",
        outline:
          "border border-border bg-transparent text-foreground hover:border-primary hover:text-primary",
        secondary:
          "bg-secondary text-secondary-foreground border border-border hover:border-primary/50 hover:text-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type Ripple = { id: number; x: number; y: number };
type Particle = { id: number; x: number; y: number; angle: number; velocity: number };

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<Ripple[]>([]);
    const [particles, setParticles] = React.useState<Particle[]>([]);
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    const idRef = React.useRef(0);

    const handlePointerDown = React.useCallback(
      (e: React.PointerEvent<HTMLButtonElement>) => {
        const el = buttonRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = ++idRef.current;

        // Ripple
        setRipples((prev) => [...prev, { id, x, y }]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 600);

        // Particles burst
        const newParticles: Particle[] = Array.from({ length: 4 }, (_, i) => ({
          id: ++idRef.current,
          x,
          y,
          angle: (i / 4) * Math.PI * 2,
          velocity: 30 + Math.random() * 20,
        }));
        setParticles((prev) => [...prev, ...newParticles]);
        setTimeout(() => {
          const ids = new Set(newParticles.map((p) => p.id));
          setParticles((prev) => prev.filter((p) => !ids.has(p.id)));
        }, 500);
      },
      []
    );

    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={(node) => {
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
          buttonRef.current = node;
        }}
        onPointerDown={handlePointerDown}
        {...props}
      >
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute pointer-events-none rounded-full bg-white/20 animate-ripple"
            style={{
              left: r.x - 8,
              top: r.y - 8,
              width: 16,
              height: 16,
            }}
          />
        ))}
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute pointer-events-none rounded-full bg-primary/50"
            style={{
              width: 3,
              height: 3,
              left: p.x,
              top: p.y,
            }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: Math.cos(p.angle) * p.velocity,
              y: Math.sin(p.angle) * p.velocity,
              opacity: 0,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        ))}
        {props.children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
