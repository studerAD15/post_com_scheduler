/**
 * soundEngine.ts - Web Audio & Audio element sound manager for Omnitrix Action Transitions.
 * Features preloading, sound pooling, Web Audio synthesized fallbacks, and local storage persistence.
 */

import { STORAGE_PREFIX } from "../../utils/storage";

const MUTE_STORAGE_KEY = STORAGE_PREFIX + "omnitrix_muted";

// Retrieve initial mute status (default: false / unmuted)
export function isOmnitrixMuted(): boolean {
  try {
    const raw = localStorage.getItem(MUTE_STORAGE_KEY);
    return raw !== null ? JSON.parse(raw) === true : false;
  } catch {
    return false;
  }
}

// Persist mute status
export function setOmnitrixMuted(muted: boolean): void {
  try {
    localStorage.setItem(MUTE_STORAGE_KEY, JSON.stringify(muted));
  } catch (err) {
    console.warn("[soundEngine] Failed to save mute setting:", err);
  }
}

// Web Audio Context single instance for synthetic fallbacks
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Preloaded Audio Element pools
const ACTIVATE_SRC = "/sounds/omnitrix-activate.mp3";
const CONFIRM_SRC = "/sounds/omnitrix-confirm.mp3";

const activatePool: HTMLAudioElement[] = [];
const confirmPool: HTMLAudioElement[] = [];
const POOL_SIZE = 3;

export function preloadOmnitrixSounds(): void {
  if (typeof window === "undefined") return;

  try {
    for (let i = 0; i < POOL_SIZE; i++) {
      const act = new Audio(ACTIVATE_SRC);
      act.preload = "auto";
      activatePool.push(act);

      const conf = new Audio(CONFIRM_SRC);
      conf.preload = "auto";
      confirmPool.push(conf);
    }
  } catch (e) {
    console.warn("[soundEngine] Audio element preloading warning:", e);
  }
}

// Synthetic sound fallback using Web Audio API oscillators (futuristic Omnitrix SFX)
function playSynthActivate() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.85);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.92);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.92);
  } catch (err) {
    // Ignore audio play errors
  }
}

function playSynthConfirm(isError = false) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = isError ? "sawtooth" : "sine";
    if (isError) {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(220, now + 0.2);
    } else {
      osc.frequency.setValueAtTime(784, now);
      osc.frequency.setValueAtTime(1174.66, now + 0.18);
    }

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.48);
  } catch (err) {
    // Ignore audio play errors
  }
}

/**
 * Plays activation sound on summon/spin-up phase.
 */
export function playActivateSound(): void {
  if (isOmnitrixMuted()) return;

  const audio = activatePool.find((a) => a.paused || a.ended);
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Browser autoplay restriction or decode issue: use Web Audio synth
      playSynthActivate();
    });
  } else {
    playSynthActivate();
  }
}

/**
 * Plays confirmation chime on flash/reveal phase.
 */
export function playConfirmSound(isError = false): void {
  if (isOmnitrixMuted()) return;

  const audio = confirmPool.find((a) => a.paused || a.ended);
  if (audio && !isError) {
    audio.currentTime = 0;
    audio.play().catch(() => {
      playSynthConfirm(isError);
    });
  } else {
    playSynthConfirm(isError);
  }
}
