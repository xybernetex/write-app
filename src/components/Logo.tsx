export function LogoIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 198"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Left: end clip, outer plate, inner plate, collar */}
      <rect x="0"   y="82" width="6"  height="36" rx="1" />
      <rect x="6"   y="40" width="20" height="120" rx="4" />
      <rect x="26"  y="52" width="14" height="96"  rx="3" />
      <rect x="40"  y="64" width="12" height="72"  rx="2" />
      {/* Bar */}
      <rect x="52"  y="87" width="96" height="26" />
      {/* Right: collar, inner plate, outer plate, end clip */}
      <rect x="148" y="64" width="12" height="72"  rx="2" />
      <rect x="160" y="52" width="14" height="96"  rx="3" />
      <rect x="174" y="40" width="20" height="120" rx="4" />
      <rect x="194" y="82" width="6"  height="36" rx="1" />
      {/* Pencil: eraser cap */}
      <rect x="90"  y="2"  width="20" height="13"  rx="5" />
      {/* Pencil: eraser band */}
      <rect x="90"  y="14" width="20" height="7" />
      {/* Pencil: body */}
      <rect x="90"  y="21" width="20" height="138" />
      {/* Pencil: tip */}
      <polygon points="90,159 110,159 100,194" />
    </svg>
  );
}

export function NavLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <LogoIcon className="w-7 h-7 text-white" />
      <div className="leading-none">
        <div className="text-[9px] font-semibold tracking-[0.3em] text-zinc-500 uppercase mb-0.5">
          The
        </div>
        <div className="text-sm font-bold tracking-wide text-white leading-none">
          Writing <span className="text-blue-400">Gym</span>
        </div>
      </div>
    </div>
  );
}

export function HeroLogo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <LogoIcon className="w-20 h-20 text-white" />
      <div className="text-center leading-none">
        <div className="text-xs font-semibold tracking-[0.4em] text-zinc-500 uppercase mb-1.5">
          The
        </div>
        <div className="text-3xl font-black tracking-tight text-white leading-none">
          Writing <span className="text-blue-400">Gym</span>
        </div>
        <div className="mt-2 text-[11px] font-semibold tracking-[0.3em] text-zinc-600 uppercase">
          Practice · Improve · Express
        </div>
      </div>
    </div>
  );
}
