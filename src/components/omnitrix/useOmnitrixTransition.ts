/**
 * useOmnitrixTransition.ts - Hook and Event Bus for managing the Omnitrix Action Transition overlay state.
 */

import { useState, useEffect, useCallback } from "react";
import { playActivateSound, playConfirmSound } from "./soundEngine";

export type TransitionStatus = "success" | "error" | "loading";

export interface OmnitrixTransitionConfig {
  status: TransitionStatus;
  message: string;
  id?: string; // Unique ID to prevent duplication
}

export type TransitionPhase = "idle" | "summon" | "spin" | "reveal" | "dismiss";

type Listener = (config: OmnitrixTransitionConfig | null) => void;
const listeners = new Set<Listener>();

// Active transition trigger function
export function triggerOmnitrixTransition(config: OmnitrixTransitionConfig): void {
  listeners.forEach((listener) => listener(config));
}

// Function to force dismiss overlay
export function dismissOmnitrixTransition(): void {
  listeners.forEach((listener) => listener(null));
}

export function useOmnitrixTransition() {
  const [config, setConfig] = useState<OmnitrixTransitionConfig | null>(null);
  const [phase, setPhase] = useState<TransitionPhase>("idle");

  const checkReducedMotion = useCallback(() => {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  // Main animation timer state machine
  useEffect(() => {
    const handleTrigger = (newConfig: OmnitrixTransitionConfig | null) => {
      if (!newConfig) {
        setPhase("dismiss");
        setTimeout(() => {
          setConfig(null);
          setPhase("idle");
        }, 200);
        return;
      }

      const isReduced = checkReducedMotion();

      // Cap concurrent overlays at 1 by updating config and restarting sequence
      setConfig(newConfig);

      if (isReduced) {
        // Reduced motion: skip spin & SFX, show 150ms fade + checkmark/exclamation, then dismiss
        setPhase("reveal");
        const t1 = setTimeout(() => setPhase("dismiss"), 600);
        const t2 = setTimeout(() => {
          setConfig(null);
          setPhase("idle");
        }, 800);
        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
        };
      }

      // Full animation sequence (~2300ms total, skippable):
      // Phase 1: Summon (0 - 300ms) - Scale up dial & start activation charge SFX
      setPhase("summon");
      playActivateSound();

      const timerSpin = setTimeout(() => {
        // Phase 2: Spin-up (300ms - 1200ms) - Mechanical dial rotation & pulse glow
        setPhase("spin");
      }, 300);

      const timerReveal = setTimeout(() => {
        // Phase 3: Flash / Reveal (1200ms - 2000ms) - Radial green/orange flash & confirm chime SFX
        setPhase("reveal");
        playConfirmSound(newConfig.status === "error");
      }, 1200);

      const timerDismiss = setTimeout(() => {
        // Phase 4: Dismiss (2000ms - 2300ms) - Smooth fade out back to page
        setPhase("dismiss");
      }, 2000);

      const timerIdle = setTimeout(() => {
        setConfig(null);
        setPhase("idle");
      }, 2300);

      return () => {
        clearTimeout(timerSpin);
        clearTimeout(timerReveal);
        clearTimeout(timerDismiss);
        clearTimeout(timerIdle);
      };
    };

    listeners.add(handleTrigger);
    return () => {
      listeners.delete(handleTrigger);
    };
  }, [checkReducedMotion]);

  // Click-to-skip fast-forward handler
  const skipTransition = useCallback(() => {
    if (phase !== "idle" && phase !== "dismiss") {
      setPhase("dismiss");
      setTimeout(() => {
        setConfig(null);
        setPhase("idle");
      }, 200);
    }
  }, [phase]);

  return {
    activeConfig: config,
    phase,
    skipTransition,
    isAnimating: phase !== "idle",
  };
}
