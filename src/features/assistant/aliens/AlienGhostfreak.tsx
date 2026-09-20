import React from "react";

interface AlienProps {
  className?: string;
  animated?: boolean;
}

export const AlienGhostfreak: React.FC<AlienProps> = React.memo(({ className = "w-full h-full", animated = true }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Ghostfreak Alien Transformation"
    >
      <defs>
        {/* Spectral Shroud Gradient */}
        <linearGradient id="ghostfreak-skin" x1="20" y1="10" x2="80" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F1F5F9" />
          <stop offset="40%" stopColor="#E2E8F0" />
          <stop offset="80%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        {/* Eerie Purple Eye Glow */}
        <filter id="ghost-eye-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
      </defs>

      {/* Floating Ghostly Body */}
      <g className={animated ? "animate-alien-ghost" : ""}>
        {/* Ethereal Wispy Phantom Tail (Curves downwards to a point) */}
        <path
          d="M38 66 Q30 78 34 88 Q38 94 44 94 Q48 94 48 88 Q48 82 52 74 Q56 82 58 88 Q60 92 64 88 Q66 84 62 66 Z"
          fill="url(#ghostfreak-skin)"
          stroke="#475569"
          strokeWidth="1.2"
        />

        {/* Ghostly Torso & Hood */}
        <path
          d="M50 12 C34 12 30 24 30 40 C30 52 34 66 40 74 L60 74 C66 66 70 52 70 40 C70 24 66 12 50 12 Z"
          fill="url(#ghostfreak-skin)"
          stroke="#475569"
          strokeWidth="1.5"
        />

        {/* Left Ghost Claw Arm */}
        <path
          d="M32 46 C22 48 16 54 12 64 C16 64 22 60 26 58 L30 54"
          fill="url(#ghostfreak-skin)"
          stroke="#475569"
          strokeWidth="1.2"
        />
        {/* Left Claw Tips */}
        <path d="M12 64 L8 68 M14 65 L10 71 M16 66 L14 73" stroke="#334155" strokeWidth="1.2" strokeLinecap="round" />

        {/* Right Ghost Claw Arm */}
        <path
          d="M68 46 C78 48 84 54 88 64 C84 64 78 60 74 58 L70 54"
          fill="url(#ghostfreak-skin)"
          stroke="#475569"
          strokeWidth="1.2"
        />
        {/* Right Claw Tips */}
        <path d="M88 64 L92 68 M86 65 L90 71 M84 66 L86 73" stroke="#334155" strokeWidth="1.2" strokeLinecap="round" />

        {/* Black Suture Seam Lines (Iconic Ectonurite Track Lines) */}
        <path
          d="M50 12 C44 26 42 38 48 54 C54 70 52 78 50 92"
          stroke="#0F172A"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Cross Seam Track across Head */}
        <path
          d="M34 32 Q50 36 66 32"
          stroke="#0F172A"
          strokeWidth="2"
          fill="none"
        />

        {/* Track Cross-stitches */}
        <line x1="44" y1="20" x2="48" y2="22" stroke="#0F172A" strokeWidth="1.2" />
        <line x1="42" y1="46" x2="47" y2="48" stroke="#0F172A" strokeWidth="1.2" />
        <line x1="51" y1="62" x2="56" y2="64" stroke="#0F172A" strokeWidth="1.2" />

        {/* Ectonurite Cyclops Eye (Gliding along track) */}
        <g className={animated ? "animate-alien-eye" : ""}>
          {/* Eye Socket on Track */}
          <circle cx="50" cy="34" r="5.5" fill="#0A0A0A" stroke="#A855F7" strokeWidth="1.2" />
          {/* Glowing Violet/Magenta Iris */}
          <circle cx="50" cy="34" r="3.8" fill="#C084FC" filter="url(#ghost-eye-glow)" />
          {/* Slit Pupil */}
          <ellipse cx="50" cy="34" rx="0.9" ry="2.6" fill="#0A0A0A" />
        </g>

        {/* Omnitrix Chest Emblem */}
        <circle cx="50" cy="58" r="3.5" fill="#0A0A0A" stroke="#3DDC10" strokeWidth="1" />
        <circle cx="50" cy="58" r="1.5" fill="#3DDC10" />
      </g>
    </svg>
  );
});

AlienGhostfreak.displayName = "AlienGhostfreak";
