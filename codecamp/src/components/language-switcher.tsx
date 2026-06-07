"use client";

import { usePathname, useRouter, type Locale } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { useTransition } from "react";

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "ar", label: "AR", flag: "🇸🇦" },
];

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();
  const reduce = useReducedMotion();
  const [isPending, startTransition] = useTransition();

  function switchLocale(next: Locale) {
    if (next === currentLocale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div className="flex items-center gap-0.5" role="radiogroup" aria-label="Language">
      {LOCALES.map((loc) => {
        const active = currentLocale === loc.code;
        return (
          <motion.button
            key={loc.code}
            role="radio"
            aria-checked={active}
            disabled={isPending}
            onClick={() => switchLocale(loc.code)}
            whileHover={reduce ? undefined : { scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative text-[10px] font-semibold uppercase tracking-wider px-1.5 py-1 border transition-colors ${
              active
                ? "border-primary bg-primary/10 text-primary shadow-[var(--glow-soft)]"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {loc.label}
            {active && (
              <motion.span
                layoutId="lang-active"
                className="absolute inset-0 border border-primary/30 pointer-events-none"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
