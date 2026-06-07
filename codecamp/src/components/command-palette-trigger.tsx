"use client";

import { useEffect, useState } from "react";

/**
 * Visible trigger for the global command palette (`command-palette.tsx`, mounted
 * once in Providers). The palette is otherwise keyboard-only (⌘K / Ctrl+K); this
 * chip gives it a discoverable affordance. Clicking dispatches the very same
 * `eduverse:open-command-palette` event the palette already listens for.
 *
 * Plain <button> (CSS `active:scale` for press feedback) — a motion.button with a
 * reduced-motion-conditional gesture caused an SSR/hydration attribute mismatch.
 *
 * Desktop-only by design — a keyboard-shortcut chip is meaningless on touch.
 */
export function CommandPaletteTrigger() {
  // Default to "Ctrl" so SSR and the first client render agree (no hydration
  // mismatch); upgrade to ⌘ on Apple platforms after mount.
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    const platform = navigator.platform ?? "";
    setIsMac(/Mac|iPhone|iPad|iPod/i.test(platform || navigator.userAgent));
  }, []);

  const open = () => window.dispatchEvent(new Event("eduverse:open-command-palette"));

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Open command palette"
      aria-keyshortcuts={isMac ? "Meta+K" : "Control+K"}
      className="hidden md:inline-flex items-center gap-2 border border-border bg-card/40 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors active:scale-[0.97]"
    >
      <svg
        className="h-3.5 w-3.5 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <span className="hidden lg:inline">Search</span>
      <kbd className="font-mono text-[10px] leading-none tracking-wide text-primary/90 border border-border/70 bg-background/60 px-1 py-0.5">
        {isMac ? "⌘" : "Ctrl"} K
      </kbd>
    </button>
  );
}
