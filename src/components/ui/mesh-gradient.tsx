/**
 * Terminal backdrop — fixed, server-rendered, pure CSS + animated particles.
 * Layers (back to front): dimensional glow, masked grid, CRT scanline texture,
 * sweeping scanline, noise grain, floating data particles, corner accents.
 * No JS, no per-frame layout.
 */

function DataParticles() {
  const particles = Array.from({ length: 18 }, (_, i) => {
    const col = ((i * 137) % 100) / 100;
    const row = ((i * 73) % 100) / 100;
    const size = 1 + (i % 3) * 1;
    const delay = (i * 0.67) % 6;
    const dur = 6 + (i % 4) * 3;
    const isZero = i % 3 === 0;
    return {
      left: `${col * 100}%`,
      top: `${row * 100}%`,
      size,
      delay,
      dur,
      char: isZero ? "0" : "1",
      opacity: 0.2 + (i % 5) * 0.04,
    };
  });

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute font-mono text-primary select-none"
          style={{
            left: p.left,
            top: p.top,
            fontSize: `${p.size * 7}px`,
            opacity: p.opacity,
            animation: `particle-drift-${i % 3} ${p.dur}s ${p.delay}s ease-in-out infinite`,
          }}
        >
          {p.char}
        </span>
      ))}
      <style>{`
        @keyframes particle-drift-0 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0; }
          10% { opacity: 0.3; }
          50% { transform: translate(20px, -30px) scale(1.1); opacity: 0.5; }
          90% { opacity: 0.2; }
        }
        @keyframes particle-drift-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          15% { opacity: 0.25; }
          50% { transform: translate(-15px, -20px) rotate(10deg); opacity: 0.4; }
          85% { opacity: 0.15; }
        }
        @keyframes particle-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0; }
          12% { opacity: 0.35; }
          50% { transform: translate(10px, -40px) scale(1.2); opacity: 0.45; }
          88% { opacity: 0.1; }
        }
      `}</style>
    </div>
  );
}

function CornerCircuit() {
  const corners = [
    { top: "0", left: "0", rotate: "0" },
    { top: "0", right: "0", rotate: "90deg" },
    { bottom: "0", left: "0", rotate: "-90deg" },
    { bottom: "0", right: "0", rotate: "180deg" },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {corners.map((c, i) => (
        <svg
          key={i}
          className="absolute w-16 h-16 opacity-[0.08]"
          style={{ ...c, transform: `rotate(${c.rotate})` }}
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M0 20 L0 0 L20 0" className="text-primary" />
          <circle cx="8" cy="8" r="1.5" fill="currentColor" className="text-primary/40" />
          <circle cx="16" cy="16" r="1" fill="currentColor" className="text-primary/60" />
          <circle cx="4" cy="12" r="0.8" fill="currentColor" className="text-primary/30" />
        </svg>
      ))}
    </div>
  );
}

export function MeshGradient() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Dimensional accent glow, top + bottom corners */}
      <div
        className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[120vw] h-[60vh] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklch, var(--primary) 14%, transparent), transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-1/4 -left-1/4 w-[70vw] h-[50vh] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklch, var(--chart-2) 12%, transparent), transparent 70%)",
        }}
      />

      {/* Grid */}
      <div className="absolute inset-0 terminal-grid" />

      {/* CRT scanline texture + one sweeping band */}
      <div className="absolute inset-0 scanlines-static" />
      <div className="absolute inset-x-0 scanline" />

      {/* Grain */}
      <div className="absolute inset-0 noise-overlay" />

      {/* Sparkle field */}
      <div className="absolute inset-0 sparkle-field ambient-pulse" />

      {/* Floating data particles */}
      <DataParticles />

      {/* Corner circuit accents */}
      <CornerCircuit />
    </div>
  );
}
