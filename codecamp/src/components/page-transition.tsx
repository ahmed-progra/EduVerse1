"use client";

import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";

export function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10, scale: 0.98, filter: "blur(3px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.97, filter: "blur(1px)" }}
        transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.8 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
