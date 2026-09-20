import React from "react";

interface AlienProps {
  className?: string;
  animated?: boolean;
}

export const AlienStinkfly: React.FC<AlienProps> = React.memo(({ className = "w-full h-full", animated = true }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Stinkfly Alien Transformation"
    >
      <defs>
        {/* Insectoid Carapace Gradient */}
        <linearGradient id="stinkfly-shell" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4D7C0F" />
          <stop offset="50%" stopColor="#365314" />
          <stop offset="100%" stopColor="#1A2E05" />
        </linearGradient>

        {/* Translucent Wings Gradient */}
        <linearGradient id="stinkfly-wing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.75" />
          <stop offset="50%" stopColor="#34D399" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
        </linearGradient>

        {/* Amber Eye Glow */}
        <filter id="stinkfly-eye-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
      </defs>

      {/* Rapid Fluttering Translucent Wings (Background) */}
      <g className={animated ? "animate-alien-wing" : ""}>
        {/* Left Upper Wing */}
        <path
          d="M38 38 C24 16 8 18 4 32 C2 44 18 46 36 44 Z"
          fill="url(#stinkfly-wing)"
          stroke="#6EE7B7"
          strokeWidth="1"
        />
        {/* Left Lower Wing */}
        <path
          d="M38 46 C22 46 10 54 8 64 C8 72 22 68 36 54 Z"
          fill="url(#stinkfly-wing)"
          stroke="#6EE7B7"
          strokeWidth="0.8"
        />
        {/* Right Upper Wing */}
        <path
          d="M62 38 C76 16 92 18 96 32 C98 44 82 46 64 44 Z"
          fill="url(#stinkfly-wing)"
          stroke="#6EE7B7"
          strokeWidth="1"
        />
        {/* Right Lower Wing */}
        <path
          d="M62 46 C78 46 90 54 92 64 C92 72 78 68 64 54 Z"
          fill="url(#stinkfly-wing)"
          stroke="#6EE7B7"
          strokeWidth="0.8"
        />
      </g>

      {/* Segmented Stinger Tail (Extending Downward) */}
      <path
        d="M46 76 L44 86 L48 92 L50 96 L52 92 L56 86 L54 76 Z"
        fill="url(#stinkfly-shell)"
        stroke="#1A2E05"
        strokeWidth="1"
      />
      {/* Lethal Stinger Tip */}
      <polygon points="50,96 46,92 54,92" fill="#0A0A0A" />

      {/* Insect Thorax & Body */}
      <path
        d="M38 40 C38 36 42 34 50 34 C58 34 62 36 62 40 L64 74 C64 80 58 84 50 84 C42 84 36 80 36 74 Z"
        fill="url(#stinkfly-shell)"
        stroke="#14532D"
        strokeWidth="1.5"
      />

      {/* Black & White Abdominal Segments */}
      <path d="M42 42 L58 42 L56 48 L44 48 Z" fill="#0A0A0A" />
      <path d="M43 52 L57 52 L55 58 L45 58 Z" fill="#F8FAFC" />
      <path d="M44 62 L56 62 L54 68 L46 68 Z" fill="#0A0A0A" />

      {/* Insectoid Head & Mandibles */}
      <path
        d="M40 24 C40 18 44 14 50 14 C56 14 60 18 60 24 L62 36 C60 40 56 42 50 42 C44 42 40 40 38 36 Z"
        fill="url(#stinkfly-shell)"
        stroke="#14532D"
        strokeWidth="1.4"
      />

      {/* Lepidopterran 4 Eyestalks (Signature Trait) */}
      {/* Left Top Stalk & Eye */}
      <path d="M42 22 C34 16 28 14 26 18" stroke="#365314" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <circle cx="26" cy="18" r="3.8" fill="#F59E0B" stroke="#78350F" strokeWidth="1" filter="url(#stinkfly-eye-glow)" />
      <circle cx="26" cy="18" r="1.5" fill="#FEF3C7" />

      {/* Left Bottom Stalk & Eye */}
      <path d="M40 28 C32 26 26 28 24 34" stroke="#365314" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <circle cx="24" cy="34" r="3.5" fill="#F59E0B" stroke="#78350F" strokeWidth="1" filter="url(#stinkfly-eye-glow)" />
      <circle cx="24" cy="34" r="1.3" fill="#FEF3C7" />

      {/* Right Top Stalk & Eye */}
      <path d="M58 22 C66 16 72 14 74 18" stroke="#365314" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <circle cx="74" cy="18" r="3.8" fill="#F59E0B" stroke="#78350F" strokeWidth="1" filter="url(#stinkfly-eye-glow)" />
      <circle cx="74" cy="18" r="1.5" fill="#FEF3C7" />

      {/* Right Bottom Stalk & Eye */}
      <path d="M60 28 C68 26 74 28 76 34" stroke="#365314" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <circle cx="76" cy="34" r="3.5" fill="#F59E0B" stroke="#78350F" strokeWidth="1" filter="url(#stinkfly-eye-glow)" />
      <circle cx="76" cy="34" r="1.3" fill="#FEF3C7" />

      {/* Slime Nozzle / Mouth Mandibles */}
      <polygon points="46,36 50,42 54,36" fill="#14532D" stroke="#052E16" strokeWidth="1" />
      <circle cx="50" cy="40" r="1" fill="#3DDC10" />

      {/* Omnitrix Chest Emblem */}
      <circle cx="50" cy="62" r="4" fill="#0A0A0A" stroke="#3DDC10" strokeWidth="1.2" />
      <circle cx="50" cy="62" r="1.8" fill="#3DDC10" />
    </svg>
  );
});

AlienStinkfly.displayName = "AlienStinkfly";
