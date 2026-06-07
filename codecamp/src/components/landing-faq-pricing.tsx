"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useMagnetic } from "@/lib/use-magnetic";
import { fadeUpSpring } from "@/lib/motion-variants";

const FAQ_ITEMS = [
  { q: "Do I need prior coding experience?", a: "No. EduVerse starts from absolute basics in every language track. If you already know some, take a placement test to skip ahead." },
  { q: "How does the AI tutor work?", a: "When you get stuck, click \"Ask AI\". A Claude-powered tutor reads your code and the lesson context, then nudges you with hints — never the full solution." },
  { q: "Can I switch languages mid-track?", a: "Yes. Your progress is saved per course. Jump between HTML/CSS, JavaScript, Python, and C++ whenever you want." },
  { q: "What if I finish all the content?", a: "New lessons and projects are added regularly. Follow our changelog and suggest topics you'd like to see." },
  { q: "Is there a mobile app?", a: "Not yet. EduVerse is designed for desktop browsers with a real code editor. Mobile is on the roadmap." },
  { q: "How accurate is the placement test?", a: "The adaptive test adjusts difficulty based on your answers. Most learners find it places them within 1–2 lessons of their actual level." },
];

export function LandingFaqPricing() {
  const reduce = useReducedMotion();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const vp = { once: true, margin: "-80px" } as const;

  return (
    <>
      {/* FAQ */}
      <motion.section
        variants={reduce ? undefined : fadeUpSpring}
        initial={reduce ? undefined : "hidden"}
        whileInView={reduce ? undefined : "visible"}
        viewport={vp}
        className="border-t border-border py-20 md:py-24"
      >
        <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="text-primary">{"// 05"}</span> — faq
        </p>
        <h2 className="max-w-2xl text-3xl md:text-4xl font-bold text-foreground">
          Common questions.
        </h2>

        <div className="mt-8 max-w-2xl space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem key={i} item={item} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
          ))}
        </div>
      </motion.section>
    </>
  );
}

function FaqItem({ item, isOpen, onToggle }: { item: { q: string; a: string }; isOpen: boolean; onToggle: () => void }) {
  const { handlers, ref } = useMagnetic({ x: 4, y: 4, scale: 1.005 });
  return (
    <div ref={ref} {...handlers}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 border border-border bg-card/40 px-5 py-3.5 text-left text-sm font-medium text-card-foreground hover:border-primary/40 transition-colors"
      >
        <span>{item.q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25, mass: 0.6 }}
            className="overflow-hidden"
          >
            <div className="border-x border-b border-border bg-card/20 px-5 py-3.5">
              <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
