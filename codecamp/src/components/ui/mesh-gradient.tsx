export function MeshGradient() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[120vw] h-[60vh] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklch, var(--primary) 10%, transparent), transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 w-[70vw] h-[50vh] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklch, var(--secondary) 8%, transparent), transparent 70%)",
        }}
      />
    </div>
  );
}
