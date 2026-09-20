import React, { useEffect, useRef, useState } from "react";

/**
 * OmnitrixCursor.tsx - Ultra-High Performance Ben 10 Omnitrix Custom Cursor System
 *
 * Key Performance & Glitch-Free Fixes:
 * - Empty dependency array in useEffect to prevent event listener teardown frame-drops.
 * - Instant 1:1 core cursor positioning (0ms latency, zero lag on mouse movement).
 * - Fast, reflow-free element detection (no expensive getComputedStyle calls on mouseover).
 * - Direct DOM attribute updates for mode switching (hover, danger, click, native) without triggering React re-renders.
 * - Hardware accelerated translate3d positioning for 60-120 FPS rendering.
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

  // Mouse & smooth positions
  const mousePosRef = useRef({ x: -100, y: -100 });
  const trailPosRef = useRef({ x: -100, y: -100 });
  const isInitializedRef = useRef(false);
  const animFrameIdRef = useRef<number | null>(null);

  // Mutable cursor state ref (bypasses React state re-renders on every hover)
  const cursorStateRef = useRef({
    hovered: false,
    danger: false,
    active: false,
    native: false,
    visible: false,
  });

  const [isEnabled, setIsEnabled] = useState(true);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleTimeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    // Check fine pointer & reduced motion preference
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!hasFinePointer || prefersReducedMotion) {
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    // Fast event handlers
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current.x = e.clientX;
      mousePosRef.current.y = e.clientY;

      if (!isInitializedRef.current) {
        isInitializedRef.current = true;
        trailPosRef.current.x = e.clientX;
        trailPosRef.current.y = e.clientY;
      }

      if (!cursorStateRef.current.visible) {
        cursorStateRef.current.visible = true;
        updateCursorDOMState();
      }
    };

    const handleMouseLeave = () => {
      cursorStateRef.current.visible = false;
      updateCursorDOMState();
    };

    const handleMouseEnter = (e: MouseEvent) => {
      mousePosRef.current.x = e.clientX;
      mousePosRef.current.y = e.clientY;
      trailPosRef.current.x = e.clientX;
      trailPosRef.current.y = e.clientY;
      cursorStateRef.current.visible = true;
      updateCursorDOMState();
    };

    const handleMouseDown = (e: MouseEvent) => {
      cursorStateRef.current.active = true;
      updateCursorDOMState();

      // Trigger click ripple
      const accent = cursorStateRef.current.danger ? "#FF2233" : "#FF7A00";
      const newRipple: Ripple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        color: accent,
      };

      setRipples((prev) => [...prev.slice(-3), newRipple]);
      const timerId = setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        rippleTimeoutsRef.current.delete(timerId);
      }, 500);
      rippleTimeoutsRef.current.add(timerId);
    };

    const handleMouseUp = () => {
      cursorStateRef.current.active = false;
      updateCursorDOMState();
    };

    // Reflow-free fast element detection using closest selector lists
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Detect native cursor elements (inputs, textareas, contenteditable, disabled, resize handles)
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
        if (!cursorStateRef.current.native) {
          cursorStateRef.current.native = true;
          cursorStateRef.current.hovered = false;
          cursorStateRef.current.danger = false;
          updateCursorDOMState();
        }
        return;
      }

      const nextNative = false;

      // 2. Detect danger elements (Red Alert mode)
      const isDangerTarget =
        target.closest(
          '.btn-danger, [data-cursor="danger"], [data-action="delete"], [data-action="remove"], button.text-red-500, button.text-red-400, button.bg-red-600, button.bg-red-500'
        ) !== null || (target.getAttribute("aria-label")?.toLowerCase().includes("delete") ?? false);

      // 3. Detect interactive elements for hover lock-on
      const isInteractive =
        target.closest(
          'button, a, [role="button"], [role="tab"], [role="menuitem"], [role="option"], [role="switch"], input[type="button"], input[type="submit"], input[type="checkbox"], input[type="radio"], select, label, summary, [data-cursor="interactive"], .clickable, .cursor-pointer, .analytics-card-container, button[type="button"]'
        ) !== null;

      if (
        cursorStateRef.current.native !== nextNative ||
        cursorStateRef.current.danger !== isDangerTarget ||
        cursorStateRef.current.hovered !== isInteractive
      ) {
        cursorStateRef.current.native = nextNative;
        cursorStateRef.current.danger = isDangerTarget;
        cursorStateRef.current.hovered = isInteractive;
        updateCursorDOMState();
      }
    };

    // Direct DOM attribute helper (instant styling without React re-render)
    const updateCursorDOMState = () => {
      const { hovered, danger, active, native, visible } = cursorStateRef.current;
      const core = coreRef.current;
      const trail = trailRef.current;

      const stateName = danger
        ? "danger"
        : active
        ? "active"
        : hovered
        ? "hover"
        : "default";

      if (core) {
        core.setAttribute("data-state", stateName);
        core.setAttribute("data-visible", visible && !native ? "true" : "false");
      }
      if (trail) {
        trail.setAttribute("data-state", stateName);
        trail.setAttribute("data-visible", visible && !native ? "true" : "false");
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    // Render loop (60-120fps hardware accelerated update)
    const render = () => {
      const mx = mousePosRef.current.x;
      const my = mousePosRef.current.y;

      // Core Omnitrix dial is 1:1 with mouse (0ms delay)
      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${mx - 16}px, ${my - 16}px, 0)`;
      }

      // Trailing reticle ring smooth float lerp
      const dx = mx - trailPosRef.current.x;
      const dy = my - trailPosRef.current.y;
      trailPosRef.current.x += dx * 0.28;
      trailPosRef.current.y += dy * 0.28;

      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trailPosRef.current.x - 24}px, ${
          trailPosRef.current.y - 24
        }px, 0)`;
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
      rippleTimeoutsRef.current.forEach((id) => clearTimeout(id));
      rippleTimeoutsRef.current.clear();
    };
  }, []); // Empty dependency array -> Listeners attached ONCE, zero frame drops!

  if (!isEnabled) {
    return null;
  }

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
        data-state="default"
        data-visible="false"
        className="fixed top-0 left-0 w-12 h-12 pointer-events-none z-[999998] will-change-transform opacity-0 scale-50 transition-opacity duration-200 data-[visible=true]:opacity-80 data-[visible=true]:scale-100"
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      >
        <svg
          viewBox="0 0 48 48"
          className="w-full h-full transition-transform duration-200 group-data-[state=hover]:rotate-45 group-data-[state=hover]:scale-110 group-data-[state=danger]:rotate-45 group-data-[state=danger]:scale-125 group-data-[state=active]:rotate-90 group-data-[state=active]:scale-90"
        >
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeDasharray="6 4"
            className="text-[#3DDC10] [div[data-state=hover]_&]:text-[#55FF22] [div[data-state=danger]_&]:text-[#FF2233] [div[data-state=active]_&]:text-[#FF7A00]"
          />
          <line x1="24" y1="1" x2="24" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[#3DDC10] [div[data-state=hover]_&]:text-[#55FF22] [div[data-state=danger]_&]:text-[#FF2233] [div[data-state=active]_&]:text-[#FF7A00]" />
          <line x1="24" y1="43" x2="24" y2="47" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[#3DDC10] [div[data-state=hover]_&]:text-[#55FF22] [div[data-state=danger]_&]:text-[#FF2233] [div[data-state=active]_&]:text-[#FF7A00]" />
          <line x1="1" y1="24" x2="5" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[#3DDC10] [div[data-state=hover]_&]:text-[#55FF22] [div[data-state=danger]_&]:text-[#FF2233] [div[data-state=active]_&]:text-[#FF7A00]" />
          <line x1="43" y1="24" x2="47" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[#3DDC10] [div[data-state=hover]_&]:text-[#55FF22] [div[data-state=danger]_&]:text-[#FF2233] [div[data-state=active]_&]:text-[#FF7A00]" />
          <path d="M 12 6 L 6 6 L 6 12" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.7" className="text-[#3DDC10] [div[data-state=hover]_&]:text-[#55FF22] [div[data-state=danger]_&]:text-[#FF2233]" />
          <path d="M 36 6 L 42 6 L 42 12" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.7" className="text-[#3DDC10] [div[data-state=hover]_&]:text-[#55FF22] [div[data-state=danger]_&]:text-[#FF2233]" />
          <path d="M 12 42 L 6 42 L 6 36" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.7" className="text-[#3DDC10] [div[data-state=hover]_&]:text-[#55FF22] [div[data-state=danger]_&]:text-[#FF2233]" />
          <path d="M 36 42 L 42 42 L 42 36" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.7" className="text-[#3DDC10] [div[data-state=hover]_&]:text-[#55FF22] [div[data-state=danger]_&]:text-[#FF2233]" />
        </svg>
      </div>

      {/* Main Omnitrix Dial Core Cursor (32x32 px centered) */}
      <div
        ref={coreRef}
        aria-hidden="true"
        data-state="default"
        data-visible="false"
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[999999] will-change-transform opacity-0 transition-opacity duration-150 data-[visible=true]:opacity-100 group"
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      >
        {/* Core Glow Aura */}
        <div className="absolute inset-0 rounded-full transition-all duration-150 scale-100 bg-[#3DDC10]/25 shadow-[0_0_14px_rgba(61,220,16,0.45)] [div[data-state=hover]_&]:scale-125 [div[data-state=hover]_&]:bg-[#55FF22]/40 [div[data-state=hover]_&]:shadow-[0_0_20px_#55FF22] [div[data-state=danger]_&]:scale-130 [div[data-state=danger]_&]:bg-[#FF2233]/40 [div[data-state=danger]_&]:shadow-[0_0_24px_#FF2233] [div[data-state=active]_&]:scale-125 [div[data-state=active]_&]:bg-[#FF7A00]/40 [div[data-state=active]_&]:shadow-[0_0_22px_#FF7A00]" />

        {/* Omnitrix Dial Vector Rendering */}
        <div className="w-full h-full relative transition-transform duration-150 ease-out scale-100 rotate-0 [div[data-state=hover]_&]:scale-110 [div[data-state=hover]_&]:rotate-12 [div[data-state=danger]_&]:scale-110 [div[data-state=danger]_&]:rotate-12 [div[data-state=active]_&]:scale-90 [div[data-state=active]_&]:rotate-45">
          <svg viewBox="0 0 32 32" className="w-8 h-8 block pointer-events-none select-none">
            <defs>
              <linearGradient id="omniBezelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#333333" />
                <stop offset="50%" stopColor="#181818" />
                <stop offset="100%" stopColor="#0A0A0A" />
              </linearGradient>
            </defs>

            {/* Outer Metallic Bezel Ring */}
            <circle
              cx="16"
              cy="16"
              r="13.5"
              fill="url(#omniBezelGrad)"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-[#3DDC10] [div[data-state=hover]_&]:text-[#55FF22] [div[data-state=danger]_&]:text-[#FF2233] [div[data-state=active]_&]:text-[#FF7A00]"
            />

            {/* Inner Dark Bezel Chamber */}
            <circle cx="16" cy="16" r="10.2" fill="#0A0A0A" stroke="#262626" strokeWidth="1" />

            {/* Dial Notches / Buttons (N, S, E, W) */}
            <rect x="14.5" y="1.2" width="3" height="3" rx="0.6" fill="currentColor" className="text-[#3DDC10] [div[data-state=hover]_&]:fill-[#55FF22] [div[data-state=danger]_&]:fill-[#FF2233] [div[data-state=active]_&]:fill-[#FF7A00]" />
            <rect x="14.5" y="27.8" width="3" height="3" rx="0.6" fill="currentColor" className="text-[#3DDC10] [div[data-state=hover]_&]:fill-[#55FF22] [div[data-state=danger]_&]:fill-[#FF2233] [div[data-state=active]_&]:fill-[#FF7A00]" />
            <rect x="1.2" y="14.5" width="3" height="3" rx="0.6" fill="currentColor" className="text-[#3DDC10] [div[data-state=hover]_&]:fill-[#55FF22] [div[data-state=danger]_&]:fill-[#FF2233] [div[data-state=active]_&]:fill-[#FF7A00]" />
            <rect x="27.8" y="14.5" width="3" height="3" rx="0.6" fill="currentColor" className="text-[#3DDC10] [div[data-state=hover]_&]:fill-[#55FF22] [div[data-state=danger]_&]:fill-[#FF2233] [div[data-state=active]_&]:fill-[#FF7A00]" />

            {/* Iconic Ben 10 Hourglass Silhouette */}
            <g transform="translate(16, 16)">
              <path
                d="M -7,-7.2 L 7,-7.2 L 2.4,-1 L -2.4,-1 Z"
                fill="currentColor"
                stroke="#050505"
                strokeWidth="0.6"
                className="text-[#3DDC10] [div[data-state=hover]_&]:fill-[#55FF22] [div[data-state=danger]_&]:fill-[#FF2233] [div[data-state=active]_&]:fill-[#FF7A00]"
              />
              <path
                d="M -7,7.2 L 7,7.2 L 2.4,1 L -2.4,1 Z"
                fill="currentColor"
                stroke="#050505"
                strokeWidth="0.6"
                className="text-[#3DDC10] [div[data-state=hover]_&]:fill-[#55FF22] [div[data-state=danger]_&]:fill-[#FF2233] [div[data-state=active]_&]:fill-[#FF7A00]"
              />
              {/* Central Core Jewel Node */}
              <circle cx="0" cy="0" r="2.5" fill="#0A0A0A" stroke="currentColor" strokeWidth="0.8" className="text-[#3DDC10] [div[data-state=hover]_&]:stroke-[#55FF22] [div[data-state=danger]_&]:stroke-[#FF2233] [div[data-state=active]_&]:stroke-[#FF7A00]" />
              <circle cx="0" cy="0" r="1.1" fill="currentColor" className="text-[#3DDC10] [div[data-state=hover]_&]:fill-[#55FF22] [div[data-state=danger]_&]:fill-[#FF2233] [div[data-state=active]_&]:fill-[#FF7A00]" />
            </g>
          </svg>
        </div>
      </div>
    </>
  );
};

export default OmnitrixCursor;
