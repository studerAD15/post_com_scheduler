import React, { useEffect, useRef } from "react";
import "./login-background.css";

/**
 * LoginBackground.tsx - Ben 10 / Omnitrix Intro Sci-Fi Background Component
 *
 * Layers (bottom -> top, pointer-events: none):
 * 1. Base void radial gradient (#0A0A0A center to deep dark edges).
 * 2. Energy grid layer - continuous diagonal scrolling alien/DNA SVG pattern.
 * 3. Orbiting Omnitrix dial SVG glyphs (top-right & bottom-left corners).
 * 4. Interactive HTML5 Canvas particle sparks (Omnitrix Green #3DDC10 & Solar Orange #FF7A00).
 * 5. Sweeping scan-line + corner hazard brackets.
 * 6. Smooth requestAnimationFrame cursor spotlight & parallax tracking.
 */
export const LoginBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse position tracking for parallax and cursor spotlight
  const mouseRef = useRef({
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    initialized: false,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check fine pointer & reduced motion
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Mouse movement handler
    const handleMouseMove = (e: MouseEvent) => {
      if (isTouch || prefersReducedMotion) return;

      const rect = container.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;

      // Center offset from -0.5 to 0.5
      const normX = relativeX / rect.width - 0.5;
      const normY = relativeY / rect.height - 0.5;

      mouseRef.current.targetX = normX * 40; // Max 20px parallax
      mouseRef.current.targetY = normY * 40;

      if (!mouseRef.current.initialized) {
        mouseRef.current.currentX = mouseRef.current.targetX;
        mouseRef.current.currentY = mouseRef.current.targetY;
        mouseRef.current.initialized = true;
      }

      // Update CSS variables for cursor spotlight without React re-render
      container.style.setProperty("--mouse-x", `${relativeX}px`);
      container.style.setProperty("--mouse-y", `${relativeY}px`);
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave);

    // Smooth animation loop for parallax variables
    let animFrameId: number;

    const updateParallax = () => {
      if (!prefersReducedMotion && !isTouch) {
        const m = mouseRef.current;
        m.currentX += (m.targetX - m.currentX) * 0.08;
        m.currentY += (m.targetY - m.currentY) * 0.08;

        container.style.setProperty("--parallax-x", `${m.currentX.toFixed(2)}px`);
        container.style.setProperty("--parallax-y", `${m.currentY.toFixed(2)}px`);
      }

      animFrameId = requestAnimationFrame(updateParallax);
    };

    animFrameId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  // Canvas particle sparks effect (Layer 4)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const isMobile = window.innerWidth < 640;
    const particleCount = isMobile ? 12 : 24;

    interface Spark {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      sineAmp: number;
      sineFreq: number;
      opacity: number;
      color: string;
      phase: number;
    }

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const sparks: Spark[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 1 + Math.random() * 2,
      speedY: 0.3 + Math.random() * 0.7,
      sineAmp: 10 + Math.random() * 20,
      sineFreq: 0.01 + Math.random() * 0.02,
      opacity: 0.2 + Math.random() * 0.6,
      color: Math.random() > 0.2 ? "#3DDC10" : "#FF7A00", // 80% Green, 20% Orange
      phase: Math.random() * Math.PI * 2,
    }));

    const renderSparks = () => {
      ctx.clearRect(0, 0, width, height);

      sparks.forEach((s) => {
        s.phase += s.sineFreq;
        s.y -= s.speedY;
        const currentX = s.x + Math.sin(s.phase) * s.sineAmp;

        // Wrap around top -> bottom
        if (s.y < -10) {
          s.y = height + 10;
          s.x = Math.random() * width;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(currentX, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.opacity;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(renderSparks);
    };

    animId = requestAnimationFrame(renderSparks);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
    >
      {/* LAYER 1: Base Clean White Background */}
      <div className="absolute inset-0 bg-[#FFFFFF]" />

      {/* LAYER 1.5: Cursor Spotlight Energy Glow */}
      <div
        className="absolute inset-0 transition-opacity duration-500 opacity-60"
        style={{
          background:
            "radial-gradient(circle 440px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(61, 220, 16, 0.12), transparent 70%)",
        }}
      />

      {/* LAYER 2: Energy Grid Layer (Light CAD grid + Parallax) */}
      <div
        className="absolute -inset-10 opacity-[0.35] animate-login-grid"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40' fill='none' stroke='%23D4D4D8' stroke-width='1'/%3E%3Ccircle cx='20' cy='20' r='1.5' fill='%233DDC10'/%3E%3C/svg%3E")`,
          transform:
            "translate3d(calc(var(--parallax-x, 0px) * 0.25), calc(var(--parallax-y, 0px) * 0.25), 0)",
        }}
      />

      {/* LAYER 3: Orbiting Omnitrix Dial SVG Glyphs (Far Off-Center Corners) */}
      {/* Top-Right Omnitrix Dial Silhouette */}
      <div
        className="absolute -top-16 -right-16 w-80 h-80 sm:w-96 sm:h-96 opacity-15 animate-login-spin-slow"
        style={{
          transform:
            "translate3d(calc(var(--parallax-x, 0px) * 0.45), calc(var(--parallax-y, 0px) * 0.45), 0)",
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#0A0A0A]">
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="28" fill="#F4F4F5" stroke="currentColor" strokeWidth="1.5" />
          {/* Hourglass */}
          <path d="M 28 28 L 72 28 L 56 46 L 44 46 Z" fill="#3DDC10" opacity="0.85" />
          <path d="M 28 72 L 72 72 L 56 54 L 44 54 Z" fill="#3DDC10" opacity="0.85" />
          <circle cx="50" cy="50" r="6" fill="#0A0A0A" stroke="#3DDC10" strokeWidth="2" />
        </svg>
      </div>

      {/* Bottom-Left Omnitrix Dial Silhouette */}
      <div
        className="absolute -bottom-20 -left-20 w-80 h-80 sm:w-96 sm:h-96 opacity-12 animate-login-spin-reverse"
        style={{
          transform:
            "translate3d(calc(var(--parallax-x, 0px) * -0.35), calc(var(--parallax-y, 0px) * -0.35), 0)",
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#0A0A0A]">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="12 6" opacity="0.4" />
          <circle cx="50" cy="50" r="36" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M 30 30 L 70 30 L 55 45 L 45 45 Z" fill="#3DDC10" opacity="0.7" />
          <path d="M 30 70 L 70 70 L 55 55 L 45 55 Z" fill="#3DDC10" opacity="0.7" />
          <circle cx="50" cy="50" r="7" fill="#0A0A0A" stroke="#3DDC10" strokeWidth="2" />
        </svg>
      </div>

      {/* LAYER 4: HTML5 Canvas Alien DNA Spark Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          transform:
            "translate3d(calc(var(--parallax-x, 0px) * 0.8), calc(var(--parallax-y, 0px) * 0.8), 0)",
        }}
      />

      {/* LAYER 5: Sweeping Scanline Accent */}
      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#3DDC10]/25 to-transparent animate-login-scanline" />

      {/* LAYER 5.5: Corner Sci-Fi Hazard Brackets */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#0A0A0A]/20" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#0A0A0A]/20" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#0A0A0A]/20" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#0A0A0A]/20" />
    </div>
  );
};
