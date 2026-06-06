import { useCallback, useRef, type PointerEvent } from "react";
import { useMotionValue, useSpring, useTransform } from "motion/react";

type MagneticOptions = {
  x?: number;
  y?: number;
  scale?: number;
};

export function useMagnetic(opts: MagneticOptions = {}) {
  const { x = 6, y = 6, scale = 1.01 } = opts;
  const ref = useRef<HTMLElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const pendingRef = useRef<{ cx: number; cy: number } | null>(null);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const springX = useSpring(mx, { stiffness: 300, damping: 25 });
  const springY = useSpring(my, { stiffness: 300, damping: 25 });

  const dx = useTransform(springX, [0, 1], [-x, x]);
  const dy = useTransform(springY, [0, 1], [-y, y]);

  const applyFrame = useCallback(() => {
    frameRef.current = null;
    const el = ref.current;
    const p = pendingRef.current;
    if (!el || !p) return;
    const rect = el.getBoundingClientRect();
    mx.set((p.cx - rect.left) / rect.width);
    my.set((p.cy - rect.top) / rect.height);
  }, [mx, my]);

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      pendingRef.current = { cx: e.clientX, cy: e.clientY };
      if (frameRef.current == null) {
        frameRef.current = requestAnimationFrame(applyFrame);
      }
    },
    [applyFrame]
  );

  const onPointerLeave = useCallback(() => {
    pendingRef.current = null;
    mx.set(0.5);
    my.set(0.5);
  }, [mx, my]);

  const setRef = useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);

  return {
    handlers: { onPointerMove, onPointerLeave } as const,
    ref: setRef,
    style: {
      transform: `translate(${dx.get()}px, ${dy.get()}px) scale(${scale})`,
    } as React.CSSProperties,
  };
}
