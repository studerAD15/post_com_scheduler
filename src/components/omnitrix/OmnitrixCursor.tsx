import React, { useEffect, useRef, useState } from "react";

/**
 * OmnitrixCursor.tsx - Next-Gen Ben 10 Omnitrix Custom Cursor System
 *
 * Key Enhancements:
 * - Zero-latency initial snap positioning (eliminates top-left (-100,-100) fly-in glitch).
 * - Velocity vector physics: stretch & tilt alignment on swift mouse flicks.
 * - Multi-State Omnitrix Themes:
 *   - Ready: Emerald Core (#3DDC10)
 *   - Hover / Target Lock: Kinetic Lime (#55FF22)
 *   - Click / Charged: Solar Flare Orange (#FF7A00)
 *   - Danger / Destructive: Omnitrix Red Alert (#FF2233)
 * - Click Shockwave Ring: Radial energy burst on mousedown.
 * - Element Auto-Detection: Comprehensive pointer check (computed cursor, ARIA roles, danger attributes).
 * - Accessibility & Performance: Hardware accelerated translate3d, reduced-motion bypass.
 */

interface Ripple {
  id: number;
  x: number;
  y: number;
  color: string;
}

export const OmnitrixCursor: React.FC = () => {
  const coreRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  // Mouse position target
  const mousePosRef = useRef({ x: -100, y: -100 });
  // Interpolated smooth positions
  const corePosRef = useRef({ x: -100, y: -100 });
  const trailPosRef = useRef({ x: -100, y: -100 });
  const isInitializedRef = useRef(false);
  const animFrameIdRef = useRef<number | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isDanger, setIsDanger] = useState(false);
  const [isNativeContext, setIsNativeContext] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  // Click shockwave ripples
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    // Media queries for touch devices & reduced motion
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!hasFinePointer || prefersReducedMotion) {
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };

      // Snap position on first movement to avoid swoop from (-100, -100)
      if (!isInitializedRef.current) {
        isInitializedRef.current = true;
        corePosRef.current = { x: e.clientX, y: e.clientY };
        trailPosRef.current = { x: e.clientX, y: e.clientY };
      }

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      corePosRef.current = { x: e.clientX, y: e.clientY };
      trailPosRef.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsActive(true);

      // Trigger click shockwave pulse
      const accent = isDanger ? "#FF2233" : "#FF7A00";
      const newRipple: Ripple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        color: accent,
      };

      setRipples((prev) => [...prev.slice(-4), newRipple]);

      // Auto-cleanup ripple
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 550);
    };

    const handleMouseUp = () => {
      setIsActive(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Detect elements requiring browser native cursors
      const isInput =
        target.closest(
          'input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="number"], input[type="tel"], input[type="url"], input[type="date"], input[type="datetime-local"], textarea, [contenteditable="true"], .select-text'
        ) !== null;

      const isDisabled =
        target.closest(
          "button:disabled, input:disabled, select:disabled, textarea:disabled, [aria-disabled='true'], .disabled"
        ) !== null;

      const isResizeOrMove =
        target.closest(
          '[draggable="true"], .cursor-move, .cursor-ew-resize, .cursor-ns-resize, .cursor-grab, .cursor-grabbing'
        ) !== null;

      if (isInput || isDisabled || isResizeOrMove) {
        setIsNativeContext(true);
        setIsHovered(false);
        setIsDanger(false);
        return;
      }

      setIsNativeContext(false);

      // 2. Detect destructive / danger elements (Red Omnitrix Alert Mode)
      const isDangerTarget =
        target.closest(
          '.btn-danger, [data-cursor="danger"], [data-action="delete"], [data-action="remove"], button.text-red-500, button.text-red-400, button.bg-red-600, button.bg-red-500'
        ) !== null || (target.getAttribute("aria-label")?.toLowerCase().includes("delete") ?? false);

      setIsDanger(isDangerTarget);

      // 3. Detect interactive elements for hover feedback
      let isInteractive =
        target.closest(
          'button, a, [role="button"], [role="tab"], [role="menuitem"], [role="option"], [role="switch"], input[type="button"], input[type="submit"], input[type="checkbox"], input[type="radio"], select, label, summary, [data-cursor="interactive"], .clickable, .cursor-pointer'
        ) !== null;

      if (!isInteractive) {
        try {
          const computedCursor = window.getComputedStyle(target).cursor;
          if (computedCursor === "pointer") {
            isInteractive = true;
          }
        } catch {
          // Ignore cross-origin iframe computed style errors
        }
      }

      setIsHovered(isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    // Render Animation Loop with Physics Lerp & Velocity Deformation
    const render = () => {
      // Lerp main core cursor (fast & responsive)
      const dxCore = mousePosRef.current.x - corePosRef.current.x;
      const dyCore = mousePosRef.current.y - corePosRef.current.y;
      
      const vx = dxCore * 0.42;
      const vy = dyCore * 0.42;

      corePosRef.current.x += vx;
      corePosRef.current.y += vy;

      // Lerp trailing reticle ring (smooth lag)
      const dxTrail = mousePosRef.current.x - trailPosRef.current.x;
      const dyTrail = mousePosRef.current.y - trailPosRef.current.y;
      trailPosRef.current.x += dxTrail * 0.20;
      trailPosRef.current.y += dyTrail * 0.20;

      // Calculate movement velocity & stretch physics
      const speed = Math.hypot(vx, vy);
      const angle = Math.atan2(vy, vx) * (180 / Math.PI);
      const stretchFactor = Math.min(speed * 0.012, 0.30); // Cap max stretch

      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${corePosRef.current.x - 16}px, ${
          corePosRef.current.y - 16
        }px, 0)`;
      }

      if (trailRef.current) {
        // Stretch along movement vector if moving swiftly
        const stretchTransform =
          speed > 1.8
            ? ` rotate(${angle}deg) scale(${1 + stretchFactor}, ${1 - stretchFactor * 0.4}) rotate(${-angle}deg)`
            : "";

        trailRef.current.style.transform = `translate3d(${trailPosRef.current.x - 24}px, ${
          trailPosRef.current.y - 24
        }px, 0)${stretchTransform}`;
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isVisible, isDanger]);

  if (!isEnabled) {
    return null;
  }

  const showCustomCursor = isVisible && !isNativeContext;

  // Active Omnitrix color palette
  const primaryGreen = "#3DDC10";
  const hoverGreen = "#55FF22";
  const activeOrange = "#FF7A00";
  const dangerRed = "#FF2233";

  const currentAccent = isDanger
    ? dangerRed
    : isActive
    ? activeOrange
    : isHovered
    ? hoverGreen
    : primaryGreen;

  return (
    <>
      {/* Click Energy Shockwave Ripples */}
      {ripples.map((r) => (
        <div
          key={r.id}
          aria-hidden="true"
          className="fixed top-0 left-0 w-12 h-12 pointer-events-none z-[999997] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 animate-omnitrix-ripple"
          style={{
            left: `${r.x}px`,
            top: `${r.y}px`,
            borderColor: r.color,
            boxShadow: `0 0 16px ${r.color}`,
          }}
        />
      ))}

      {/* Outer Trailing Targeting Reticle Ring (48x48 px centered) */}
      <div
        ref={trailRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 w-12 h-12 pointer-events-none z-[999998] will-change-transform transition-opacity duration-300 ${
          showCustomCursor ? "opacity-80 scale-100" : "opacity-0 scale-50"
        }`}
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      >
        <svg
          viewBox="0 0 48 48"
          className={`w-full h-full transition-transform duration-300 ${
            isActive
              ? "rotate-90 scale-80"
              : isDanger
              ? "rotate-45 scale-125 animate-pulse"
              : isHovered
              ? "rotate-45 scale-110"
              : "rotate-0 scale-100"
          }`}
        >
          {/* Dashed Reticle Outer Target Ring */}
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke={currentAccent}
            strokeWidth={isHovered || isDanger ? "1.6" : "1.2"}
            strokeDasharray={isDanger ? "3 3" : isHovered ? "5 3" : "6 4"}
            opacity={isHovered || isDanger ? "0.95" : "0.55"}
          />

          {/* Crosshair Cardinal Ticks */}
          <line x1="24" y1="1" x2="24" y2="5" stroke={currentAccent} strokeWidth="2" strokeLinecap="round" />
          <line x1="24" y1="43" x2="24" y2="47" stroke={currentAccent} strokeWidth="2" strokeLinecap="round" />
          <line x1="1" y1="24" x2="5" y2="24" stroke={currentAccent} strokeWidth="2" strokeLinecap="round" />
          <line x1="43" y1="24" x2="47" y2="24" stroke={currentAccent} strokeWidth="2" strokeLinecap="round" />

          {/* Corner Target Brackets for Lock-On feel */}
          <path d="M 12 6 L 6 6 L 6 12" fill="none" stroke={currentAccent} strokeWidth="1.2" opacity="0.7" />
          <path d="M 36 6 L 42 6 L 42 12" fill="none" stroke={currentAccent} strokeWidth="1.2" opacity="0.7" />
          <path d="M 12 42 L 6 42 L 6 36" fill="none" stroke={currentAccent} strokeWidth="1.2" opacity="0.7" />
          <path d="M 36 42 L 42 42 L 42 36" fill="none" stroke={currentAccent} strokeWidth="1.2" opacity="0.7" />
        </svg>
      </div>

      {/* Main Omnitrix Dial Core Cursor (32x32 px centered) */}
      <div
        ref={coreRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 w-8 h-8 pointer-events-none z-[999999] will-change-transform transition-opacity duration-150 ${
          showCustomCursor ? "opacity-100" : "opacity-0"
        }`}
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      >
        {/* Core Glow Atmosphere Aura */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-200 ${
            isDanger
              ? "scale-130 bg-[#FF2233]/40 shadow-[0_0_24px_#FF2233]"
              : isActive
              ? "scale-130 bg-[#FF7A00]/40 shadow-[0_0_22px_#FF7A00]"
              : isHovered
              ? "scale-125 bg-[#55FF22]/40 shadow-[0_0_20px_#55FF22]"
              : "scale-100 bg-[#3DDC10]/25 shadow-[0_0_14px_rgba(61,220,16,0.45)]"
          }`}
        />

        {/* Omnitrix Dial Vector Rendering */}
        <div
          className={`w-full h-full relative transition-transform duration-200 ease-out ${
            isActive
              ? "scale-90 rotate-45"
              : isHovered || isDanger
              ? "scale-110 rotate-12"
              : "scale-100 rotate-0"
          }`}
        >
          <svg viewBox="0 0 32 32" className="w-8 h-8 block pointer-events-none select-none">
            <defs>
              <radialGradient id="omniCoreGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={currentAccent} stopOpacity="0.85" />
                <stop offset="70%" stopColor={currentAccent} stopOpacity="0.2" />
                <stop offset="100%" stopColor="#050505" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="omniBezelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#333333" />
                <stop offset="50%" stopColor="#181818" />
                <stop offset="100%" stopColor="#0A0A0A" />
              </linearGradient>
            </defs>

            {/* Core Background Glow */}
            <circle cx="16" cy="16" r="15" fill="url(#omniCoreGrad)" />

            {/* Outer Metallic Bezel Ring */}
            <circle
              cx="16"
              cy="16"
              r="13.5"
              fill="url(#omniBezelGrad)"
              stroke={currentAccent}
              strokeWidth={isHovered || isDanger || isActive ? "2" : "1.5"}
            />

            {/* Inner Dark Bezel Chamber */}
            <circle cx="16" cy="16" r="10.2" fill="#0A0A0A" stroke="#262626" strokeWidth="1" />

            {/* Dial Notches / Buttons (N, S, E, W) */}
            <rect x="14.5" y="1.2" width="3" height="3" rx="0.6" fill={currentAccent} />
            <rect x="14.5" y="27.8" width="3" height="3" rx="0.6" fill={currentAccent} />
            <rect x="1.2" y="14.5" width="3" height="3" rx="0.6" fill={currentAccent} />
            <rect x="27.8" y="14.5" width="3" height="3" rx="0.6" fill={currentAccent} />

            {/* Iconic Ben 10 Hourglass Silhouette */}
            <g transform="translate(16, 16)">
              <path
                d="M -7,-7.2 L 7,-7.2 L 2.4,-1 L -2.4,-1 Z"
                fill={currentAccent}
                stroke="#050505"
                strokeWidth="0.6"
              />
              <path
                d="M -7,7.2 L 7,7.2 L 2.4,1 L -2.4,1 Z"
                fill={currentAccent}
                stroke="#050505"
                strokeWidth="0.6"
              />
              {/* Central Core Jewel Node */}
              <circle cx="0" cy="0" r="2.5" fill="#0A0A0A" stroke={currentAccent} strokeWidth="0.8" />
              <circle cx="0" cy="0" r="1.1" fill={currentAccent} />
            </g>
          </svg>
        </div>
      </div>
    </>
  );
};
