"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Code2 } from "lucide-react";
import { staggerSlow, fadeUpSpring } from "@/lib/motion-variants";

const FOOTER_LINKS = {
  platform: [
    { href: "/courses", label: "Courses" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/achievements", label: "Achievements" },
  ],
  account: [
    { href: "/login", label: "Sign In" },
    { href: "/register", label: "Sign Up" },
    { href: "/settings", label: "Settings" },
  ],
};

function FooterLink({ href, label, delay }: { href: string; label: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.li
      initial={reduce ? undefined : { opacity: 0, x: -8 }}
      whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay ?? 0, type: "spring", stiffness: 200, damping: 22 }}
    >
      <Link
        href={href}
        className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block"
      >
        <motion.span
          whileHover={{ x: 3 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          {label}
        </motion.span>
      </Link>
    </motion.li>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const reduce = useReducedMotion();

  return (
    <footer className="border-t border-border bg-background">
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <motion.div
        initial={reduce ? undefined : { opacity: 0, y: 20 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className="container mx-auto px-4 py-12"
      >
        <motion.div
          variants={reduce ? undefined : staggerSlow}
          initial={reduce ? undefined : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {/* Brand */}
          <motion.div
            variants={fadeUpSpring}
            className="col-span-2 md:col-span-1"
          >
            <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold text-foreground hover:text-primary transition-colors">
              <span className="w-2 h-2 rounded-full bg-primary inline-block shrink-0" aria-hidden="true" />
              <span>EduVerse</span>
              <Code2 className="h-3.5 w-3.5 text-primary/60" aria-hidden="true" />
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
              An interactive coding platform with AI-guided lessons, live code execution,
              and gamified progression.
            </p>
            <motion.div
              className="mt-4 flex items-center gap-2"
              initial={reduce ? undefined : { opacity: 0 }}
              whileInView={reduce ? undefined : { opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block shrink-0"
                animate={reduce ? undefined : { scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                All systems operational
              </span>
            </motion.div>
          </motion.div>

          {/* Platform */}
          <motion.div variants={fadeUpSpring}>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Platform
            </p>
            <ul className="space-y-2">
              {FOOTER_LINKS.platform.map((link, i) => (
                <FooterLink key={link.label} {...link} delay={i * 0.05} />
              ))}
            </ul>
          </motion.div>

          {/* Languages */}
          <motion.div variants={fadeUpSpring}>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Languages
            </p>
            <ul className="space-y-2">
              {["HTML & CSS", "JavaScript", "Python", "C++"].map((lang, i) => (
                <motion.li
                  key={lang}
                  initial={reduce ? undefined : { opacity: 0, x: -8 }}
                  whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 200, damping: 22 }}
                >
                  <span className="text-sm text-muted-foreground">{lang}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Account */}
          <motion.div variants={fadeUpSpring}>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Account
            </p>
            <ul className="space-y-2">
              {FOOTER_LINKS.account.map((link, i) => (
                <FooterLink key={link.label} {...link} delay={i * 0.05} />
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0 }}
          whileInView={reduce ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="text-xs text-muted-foreground">
            &copy; {year} EduVerse — built for the love of code.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="hover:text-foreground transition-colors cursor-default">Privacy</span>
            <span className="hover:text-foreground transition-colors cursor-default">Terms</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <span className="h-1 w-1 rounded-full bg-primary/40" />
              v1.0.0
            </span>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
