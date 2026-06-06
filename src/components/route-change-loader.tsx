"use client";

import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export function RouteChangeLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const prevRef = useRef(pathname);

  useEffect(() => {
    if (prevRef.current !== pathname) {
      setLoading(true);
      prevRef.current = pathname;
      const id = setTimeout(() => setLoading(false), 400);
      return () => clearTimeout(id);
    }
  }, [pathname]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ scaleX: 0, transformOrigin: "0% 50%" }}
          animate={{ scaleX: 1, transformOrigin: "0% 50%" }}
          exit={{ scaleX: 0, transformOrigin: "100% 50%" }}
          transition={{ type: "spring", stiffness: 120, damping: 20, mass: 0.5 }}
          className="fixed top-0 left-0 right-0 h-[3px] bg-primary z-[9999] origin-left"
          style={{ willChange: "transform" }}
        />
      )}
    </AnimatePresence>
  );
}
