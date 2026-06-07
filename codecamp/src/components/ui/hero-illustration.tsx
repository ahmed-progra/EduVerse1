"use client";

import { motion } from "motion/react";

export function HeroIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center" aria-hidden="true">
      <svg
        viewBox="0 0 500 400"
        className="w-full max-w-lg h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Desk */}
        <rect x="100" y="290" width="300" height="12" rx="4" className="fill-[#D4C5B0]" />
        <rect x="120" y="300" width="16" height="70" rx="3" className="fill-[#C4B5A0]" />
        <rect x="360" y="300" width="16" height="70" rx="3" className="fill-[#C4B5A0]" />

        {/* Laptop base */}
        <rect x="175" y="252" width="150" height="8" rx="3" className="fill-[#B8A99A]" />
        <rect x="175" y="258" width="150" height="4" rx="1" className="fill-[#A8998A]" />

        {/* Laptop screen */}
        <rect x="182" y="170" width="136" height="84" rx="6" className="fill-[#FFE8D6]" />
        <rect x="186" y="174" width="128" height="76" rx="4" className="fill-[#FF8C5A]" />

        {/* Screen glow */}
        <rect x="186" y="174" width="128" height="76" rx="4" className="fill-white/20" />

        {/* Code lines on screen */}
        <rect x="196" y="186" width="50" height="3" rx="1.5" className="fill-white/60" />
        <rect x="196" y="196" width="70" height="3" rx="1.5" className="fill-white/40" />
        <rect x="196" y="206" width="40" height="3" rx="1.5" className="fill-white/60" />
        <rect x="210" y="216" width="60" height="3" rx="1.5" className="fill-white/40" />
        <rect x="210" y="226" width="35" height="3" rx="1.5" className="fill-white/60" />
        <rect x="196" y="236" width="55" height="3" rx="1.5" className="fill-white/40" />

        {/* Screen cursor */}
        <motion.rect
          x="251" y="236" width="2" height="3" rx="1"
          className="fill-white"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />

        {/* Student silhouette — head */}
        <ellipse cx="250" cy="134" rx="22" ry="24" className="fill-[#3D322C]" />

        {/* Student — body */}
        <path d="M228 170 C228 170 235 200 250 200 C265 200 272 170 272 170 Z" className="fill-[#3D322C]" />

        {/* Student — arm left (on laptop) */}
        <path d="M228 180 C215 190 200 230 210 248" stroke="#3D322C" strokeWidth="10" strokeLinecap="round" />

        {/* Student — arm right (on laptop) */}
        <path d="M272 180 C285 190 300 230 290 248" stroke="#3D322C" strokeWidth="10" strokeLinecap="round" />

        {/* Student — glasses */}
        <circle cx="241" cy="134" r="7" className="fill-none stroke-[#FF8C5A] stroke-[2]" />
        <circle cx="259" cy="134" r="7" className="fill-none stroke-[#FF8C5A] stroke-[2]" />
        <path d="M248 134 L252 134" stroke="#FF8C5A" strokeWidth="2" />

        {/* Floating code elements */}
        {/* Left brace */}
        <motion.g
          animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <text x="50" y="120" className="fill-[#FF8C5A]/60 text-2xl font-mono" fontSize="28">{`{ }`}</text>
        </motion.g>

        {/* Right angle bracket */}
        <motion.g
          animate={{ y: [0, -6, 0], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <text x="420" y="100" className="fill-[#7C5CFC]/60 text-2xl font-mono" fontSize="24">{`< />`}</text>
        </motion.g>

        {/* Floating star */}
        <motion.g
          animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <path
            d="M80 220 L84 210 L94 210 L86 204 L88 194 L80 200 L72 194 L74 204 L66 210 L76 210 Z"
            className="fill-[#E8A838]/50"
          />
        </motion.g>

        {/* Floating sparkle dots */}
        <motion.circle
          cx="420" cy="220" r="3"
          className="fill-[#FF8C5A]/40"
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
        />
        <motion.circle
          cx="60" cy="260" r="2"
          className="fill-[#7C5CFC]/40"
          animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.7, 1.1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.8 }}
        />
        <motion.circle
          cx="440" cy="280" r="2.5"
          className="fill-[#2EC4B6]/40"
          animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.9, 1.3, 0.9] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: 1.5 }}
        />

        {/* Small decorative lines (code-like) */}
        <motion.g
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <rect x="38" y="180" width="30" height="2" rx="1" className="fill-[#FF8C5A]/30" />
          <rect x="42" y="190" width="20" height="2" rx="1" className="fill-[#FF8C5A]/20" />
          <rect x="35" y="200" width="25" height="2" rx="1" className="fill-[#FF8C5A]/30" />
        </motion.g>

        <motion.g
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
        >
          <rect x="430" y="160" width="25" height="2" rx="1" className="fill-[#7C5CFC]/30" />
          <rect x="435" y="170" width="18" height="2" rx="1" className="fill-[#7C5CFC]/20" />
          <rect x="432" y="180" width="22" height="2" rx="1" className="fill-[#7C5CFC]/30" />
        </motion.g>

        {/* Glow behind laptop */}
        <ellipse cx="250" cy="240" rx="100" ry="30" className="fill-[#FF8C5A]/10" />
      </svg>
    </div>
  );
}
