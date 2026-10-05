/**
 * OmnitrixOverlay.tsx - Fullscreen Omnitrix Action Transition Overlay Component.
 * Features GPU-accelerated dial spin, radial green/orange flash, sound toggle, and screen-reader accessibility.
 * Memoized with React.memo and useCallback handlers.
 */

import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { Check, AlertTriangle, Volume2, VolumeX, Loader2 } from "lucide-react";
import { useOmnitrixTransition } from "./useOmnitrixTransition";
import { isOmnitrixMuted, setOmnitrixMuted, preloadOmnitrixSounds } from "./soundEngine";
import "./omnitrix-overlay.css";

export const OmnitrixOverlay: React.FC = React.memo(() => {
  const { activeConfig, phase, skipTransition, isAnimating } = useOmnitrixTransition();
  const [muted, setMuted] = useState<boolean>(false);

  // Preload sounds on mount and sync mute state
  useEffect(() => {
    preloadOmnitrixSounds();
    setMuted(isOmnitrixMuted());
  }, []);

  const handleToggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setMuted((prevMuted) => {
      const nextMuted = !prevMuted;
      setOmnitrixMuted(nextMuted);
      return nextMuted;
    });
  }, []);

  if (!isAnimating || !activeConfig) {
    return (
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {activeConfig?.message || ""}
      </div>
    );
  }

  const isError = activeConfig.status === "error";
  const isLoading = activeConfig.status === "loading";

  // Flash color background styles
  const flashBg = isError
    ? "bg-[radial-gradient(circle_at_center,_rgba(255,122,0,0.35)_0%,_rgba(10,10,10,0.85)_75%)]"
    : "bg-[radial-gradient(circle_at_center,_rgba(61,220,16,0.35)_0%,_rgba(10,10,10,0.85)_75%)]";

  const glowShadow = isError ? "shadow-omni-warning" : "shadow-omni-lg";
  const accentColor = isError ? "text-[#FF7A00]" : "text-[#3DDC10]";
  const borderAccent = isError ? "border-[#FF7A00]" : "border-[#3DDC10]";

  return ReactDOM.createPortal(
    <div
      onClick={skipTransition}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none cursor-pointer transition-opacity duration-200 ${
        phase === "dismiss" ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
      }`}
    >
      {/* Background Dim & Radial Flash */}
      <div className="absolute inset-0 bg-[#0A0A0A]/70 backdrop-blur-[2px]" />

      {phase === "reveal" && (
        <div className={`absolute inset-0 ${flashBg} animate-omni-radial-expand pointer-events-none`} />
      )}

      {/* Screen Reader Announcement */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {activeConfig.message}
      </div>

      {/* Mute Toggle Button (Top Right Header) */}
      <button
        onClick={handleToggleMute}
        title={muted ? "Unmute Omnitrix SFX" : "Mute Omnitrix SFX"}
        className="absolute top-4 right-4 z-50 p-2.5 bg-[#FFFFFF] hover:bg-[#0A0A0A] hover:text-[#FFFFFF] border-2 border-[#0A0A0A] text-[#0A0A0A] rounded-sm transition-all shadow-md flex items-center gap-2 text-xs font-orbitron uppercase tracking-wider"
      >
        {muted ? (
          <>
            <VolumeX className="w-4 h-4 text-[#FF7A00]" />
            <span className="hidden sm:inline text-[#FF7A00]">SFX OFF</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 text-[#15803D]" />
            <span className="hidden sm:inline text-[#15803D]">SFX ON</span>
          </>
        )}
      </button>

      {/* Omnitrix Dial Centerpiece */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center p-6 ${
          phase === "summon" ? "animate-omni-summon" : ""
        }`}
      >
        {/* Outer Glowing Metallic Ring */}
        <div
          className={`relative w-44 h-44 sm:w-60 sm:h-60 rounded-full bg-[#141414] border-4 ${borderAccent} flex items-center justify-center ${glowShadow} ${
            isError ? "animate-omni-pulse-orange" : "animate-omni-pulse"
          }`}
        >
          {/* Outer Industrial Rotating Bezel */}
          <div
            className={`absolute inset-1 rounded-full border-2 border-dashed ${borderAccent}/60 ${
              phase === "spin" || isLoading ? "animate-omni-spin" : ""
            }`}
          />

          {/* Inner Counter-Rotating Mechanical Ring */}
          <div
            className={`absolute inset-3 rounded-full border-2 border-[#2A2A2A] ${
              phase === "spin" || isLoading ? "animate-omni-counter-spin" : ""
            }`}
          >
            {/* Quadrant Markers */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#3DDC10] rounded-full" />
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#3DDC10] rounded-full" />
            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#3DDC10] rounded-full" />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#3DDC10] rounded-full" />
          </div>

          {/* Core Dial Display */}
          <div className="relative w-28 h-28 sm:w-40 sm:h-40 rounded-full bg-[#0A0A0A] border-2 border-[#2A2A2A] flex items-center justify-center overflow-hidden">
            {phase === "reveal" ? (
              isError ? (
                <div className="flex flex-col items-center animate-bounce">
                  <AlertTriangle className="w-14 h-14 sm:w-20 sm:h-20 text-[#FF7A00] drop-shadow-[0_0_12px_rgba(255,122,0,0.8)]" />
                </div>
              ) : (
                <div className="flex flex-col items-center animate-bounce">
                  <Check className="w-14 h-14 sm:w-20 sm:h-20 text-[#3DDC10] drop-shadow-[0_0_12px_rgba(61,220,16,0.8)]" />
                </div>
              )
            ) : (
              /* Hourglass Omnitrix Symbol */
              <div
                className={`transition-transform duration-300 ${
                  phase === "spin" || isLoading ? "animate-omni-spin" : ""
                }`}
              >
                <img
                  src="/omnitrix-dial.svg"
                  alt="Omnitrix Dial"
                  className="w-20 h-20 sm:w-28 sm:28 drop-shadow-[0_0_15px_rgba(61,220,16,0.6)]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Status Readout Banner */}
        <div className="mt-6 flex flex-col items-center gap-1.5 text-center">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#FFFFFF] border-2 border-[#0A0A0A] rounded-sm shadow-omni">
            {isLoading && <Loader2 className="w-4 h-4 text-[#15803D] animate-spin" />}
            <span className={`text-xs sm:text-sm font-orbitron font-extrabold uppercase tracking-widest ${accentColor}`}>
              {activeConfig.message}
            </span>
          </div>

          <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider">
            [ TAP ANYWHERE TO SKIP ]
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
});
OmnitrixOverlay.displayName = "OmnitrixOverlay";

export default OmnitrixOverlay;
