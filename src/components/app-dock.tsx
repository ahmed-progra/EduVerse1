"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  Crosshair,
  Radar,
  Medal,
  Award,
  Settings,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { staggerMedium, bounceIn } from "@/lib/motion-variants";

const dockItems = [
  { id: "dashboard", label: "Dashboard", icon: Crosshair, href: "/dashboard" },
  { id: "courses", label: "Courses", icon: Radar, href: "/courses" },
  { id: "leaderboard", label: "Leaderboard", icon: Medal, href: "/leaderboard" },
  { id: "achievements", label: "Achievements", icon: Award, href: "/achievements" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

export function AppDock() {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const isPublic = pathname === "/login" || pathname === "/register" || pathname === "/" || pathname === "/demo";
  if (isPublic) return null;

  return (
    <motion.div
      initial={reduce ? undefined : { y: 40, opacity: 0 }}
      animate={reduce ? undefined : { y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.15 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
    >
      <motion.div
        variants={reduce ? undefined : staggerMedium}
        initial={reduce ? undefined : "hidden"}
        animate={reduce ? undefined : "show"}
        className="flex items-end gap-1.5 px-3 py-2 rounded-[var(--radius)] border border-border bg-card/90 backdrop-blur-lg shadow-[var(--glow-soft)] border-t-primary/10"
      >
        {dockItems.map((item) => {
          const isActive = item.href !== "/" && (pathname === item.href || pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;

          return (
            <motion.div
              key={item.id}
              variants={reduce ? undefined : bounceIn}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative flex items-center justify-center w-10 h-10 rounded-lg border transition-colors",
                      isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    )}
                  >
                    <motion.span
                      className="flex items-center justify-center w-full h-full"
                      whileHover={{ scale: 1.2, rotate: [0, -5, 5, 0] }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400, damping: 12 }}
                    >
                      <Icon className="h-4 w-4" />
                    </motion.span>
                    {isActive && (
                      <motion.span
                        layoutId="dock-active"
                        className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      />
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={8}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
