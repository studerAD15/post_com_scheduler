/**
 * AvatarPickerModal.tsx - 10 Animated Ben 10 Alien Hero Selection Modal.
 *
 * Fully styled with Tailwind CSS, features interactive animated vector previews,
 * elemental power badges, and keyboard navigation (Escape to close, Tab navigable).
 */

import React, { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectSelectedAvatarId,
  selectIsPickerOpen,
  selectHasChosenAlien,
  setAvatarPickerOpen,
  selectAvatar,
} from "./assistantSlice";
import { ALIEN_REGISTRY, AlienAvatarConfig, getAlienConfig } from "./alienRegistry";
import { X, Check, Sparkles, Shield, Zap, Flame, Compass, ChevronRight } from "lucide-react";

export const AvatarPickerModal: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsPickerOpen);
  const selectedId = useAppSelector(selectSelectedAvatarId);
  const hasChosenAlien = useAppSelector(selectHasChosenAlien);

  // Staged selection before user confirms
  const [stagedId, setStagedId] = useState<string>(selectedId);

  // Sync stagedId when modal opens
  useEffect(() => {
    if (isOpen) {
      setStagedId(selectedId);
    }
  }, [isOpen, selectedId]);

  const stagedAlien = getAlienConfig(stagedId);
  const StagedAvatar = stagedAlien.Component;

  const handleClose = useCallback(() => {
    // If user hasn't chosen an alien yet, auto-select the staged one on close
    if (!hasChosenAlien) {
      dispatch(selectAvatar(stagedId));
    }
    dispatch(setAvatarPickerOpen(false));
  }, [dispatch, hasChosenAlien, stagedId]);

  const handleConfirm = useCallback(() => {
    dispatch(selectAvatar(stagedId));
    dispatch(setAvatarPickerOpen(false));
  }, [dispatch, stagedId]);

  // Keyboard accessibility: Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="avatar-picker-title"
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className="bg-[#141414] text-[#FFFFFF] border-2 border-[#3DDC10] rounded-sm max-w-4xl w-full max-h-[92vh] flex flex-col shadow-omni-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 bg-[#0A0A0A] border-b border-[#2A2A2A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-[#0A0A0A] border-2 border-[#3DDC10] text-[#3DDC10] flex items-center justify-center shadow-omni">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="avatar-picker-title"
                  className="text-base sm:text-lg font-space uppercase font-extrabold tracking-wider text-[#FFFFFF]"
                >
                  OMNITRIX ALIEN HERO SELECTOR
                </h2>
                {!hasChosenAlien && (
                  <span className="text-[10px] font-mono bg-[#3DDC10] text-[#0A0A0A] px-2 py-0.5 rounded font-extrabold tracking-wider animate-pulse">
                    CHOOSE FIRST
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-[#A1A1AA]">
                Select 1 of 10 iconic animated alien transformation forms for your AI copilot
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close alien selector"
            className="p-1.5 rounded-sm text-[#71717A] hover:text-[#FFFFFF] hover:bg-[#2A2A2A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two-Column Responsive Layout */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: 10 Alien Hero Cards Grid (7 cols) */}
          <div className="lg:col-span-7 p-4 border-b lg:border-b-0 lg:border-r border-[#2A2A2A] space-y-3 overflow-y-auto max-h-[55vh] lg:max-h-[64vh]">
            <div className="flex items-center justify-between text-xs font-mono text-[#71717A] uppercase tracking-wider pb-1">
              <span>AVAILABLE DNA ROSTER (10 FORMS)</span>
              <span className="text-[#3DDC10] font-bold">CLICK TO PREVIEW</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {ALIEN_REGISTRY.map((alien: AlienAvatarConfig) => {
                const isStaged = alien.id === stagedId;
                const isCurrentlyActive = alien.id === selectedId;
                const AlienIcon = alien.Component;

                return (
                  <button
                    key={alien.id}
                    type="button"
                    onClick={() => setStagedId(alien.id)}
                    className={`group relative flex items-center gap-2.5 p-2.5 rounded-sm border-2 text-left transition-all cursor-pointer ${
                      isStaged
                        ? "bg-[#0A0A0A] border-[#3DDC10] shadow-omni scale-[1.01]"
                        : "bg-[#181818] border-[#2A2A2A] hover:border-[#3DDC10]/60 hover:bg-[#1F1F1F]"
                    }`}
                  >
                    {/* Alien Animated Vector Icon */}
                    <div
                      className={`w-11 h-11 rounded-sm p-1 shrink-0 flex items-center justify-center border transition-all ${
                        isStaged
                          ? "bg-[#0A0A0A] border-[#3DDC10] text-[#3DDC10]"
                          : "bg-[#141414] border-[#2A2A2A] text-[#E2E8F0] group-hover:border-[#3DDC10]/40"
                      }`}
                    >
                      <AlienIcon className="w-full h-full transform group-hover:scale-105 transition-transform" />
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-space font-extrabold uppercase tracking-wide text-[#FFFFFF] truncate">
                          {alien.name}
                        </span>
                        {isCurrentlyActive && (
                          <span className="text-[9px] font-mono bg-[#3DDC10]/20 text-[#3DDC10] border border-[#3DDC10]/40 px-1 rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-rajdhani font-bold uppercase text-[#3DDC10] block truncate">
                        {alien.element}
                      </span>
                      <span className="text-[9px] font-mono text-[#71717A] block truncate">
                        {alien.species.split(" ")[0]}
                      </span>
                    </div>

                    {/* Active Staged Indicator */}
                    {isStaged && (
                      <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#3DDC10] shadow-[0_0_6px_#3DDC10]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Live High-Def Animated Preview & Confirm (5 cols) */}
          <div className="lg:col-span-5 p-5 bg-[#0D0D0D] flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Preview Header Badge */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#71717A]">
                  DNA PREVIEW // {stagedAlien.codename}
                </span>
                <span className="text-[10px] font-mono font-bold text-[#3DDC10] bg-[#3DDC10]/10 border border-[#3DDC10]/30 px-2 py-0.5 rounded">
                  {stagedAlien.element}
                </span>
              </div>

              {/* Large Animated Alien Stage */}
              <div className="relative w-full aspect-square max-w-[210px] mx-auto bg-[#141414] border-2 border-[#3DDC10] rounded-sm p-4 flex items-center justify-center shadow-omni overflow-hidden group">
                {/* Radial Glow Backdrop */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${stagedAlien.color} 0%, transparent 70%)`,
                  }}
                />

                {/* Animated Vector */}
                <div className="w-full h-full relative z-10 flex items-center justify-center">
                  <StagedAvatar className="w-full h-full" animated={true} />
                </div>

                {/* Live Movement Badge */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-[#0A0A0A]/90 border border-[#2A2A2A] px-1.5 py-0.5 rounded text-[9px] font-mono text-[#3DDC10]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3DDC10] animate-ping" />
                  LIVE ANIMATION
                </div>
              </div>

              {/* Alien Details & Lore */}
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-space font-extrabold uppercase text-[#FFFFFF] tracking-wider">
                    {stagedAlien.name}
                  </h3>
                  <span className="text-xs font-mono text-[#A1A1AA]">{stagedAlien.species}</span>
                </div>

                <p className="text-xs font-inter text-[#D4D4D8] leading-relaxed">
                  {stagedAlien.description}
                </p>

                {/* Sample Persona Voice Quote */}
                <div className="p-2.5 bg-[#181818] border-l-2 border-[#3DDC10] rounded-r-sm text-[11px] font-switzer italic text-[#A1A1AA]">
                  "{stagedAlien.greeting}"
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleConfirm}
                className="w-full py-2.5 px-4 bg-[#3DDC10] hover:bg-[#34C20C] active:scale-[0.99] text-[#0A0A0A] font-space font-extrabold uppercase tracking-wider text-xs rounded-sm shadow-omni transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                CONFIRM {stagedAlien.name.toUpperCase()} TRANSFORMATION
              </button>

              <p className="text-[10px] font-mono text-center text-[#71717A]">
                Instant activation across launcher, widget, and message streams
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

AvatarPickerModal.displayName = "AvatarPickerModal";
