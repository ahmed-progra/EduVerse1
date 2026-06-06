"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedNumberProps = {
  value: number;
  suffix?: string;
  duration?: number;
  formatter?: (n: number) => string;
  className?: string;
};

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function AnimatedNumber({ value, suffix = "", duration = 800, formatter, className }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (value === prevRef.current) return;
    const start = prevRef.current;
    const diff = value - start;
    const startTime = performance.now();
    prevRef.current = value;

    function tick(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      setDisplay(Math.floor(start + easeOutCubic(t) * diff));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  useEffect(() => {
    prevRef.current = value;
    setDisplay(value);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formatted = formatter ? formatter(display) : String(display);

  return <span className={className}>{formatted}{suffix}</span>;
}
