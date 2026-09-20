import React from "react";

export const AlienTitan: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Titan-Crush - Armored Strength Behemoth Alien"
  >
    {/* Heavy Quad-Brow & Shoulder Armor Ridge */}
    <path
      d="M8 20L20 8L44 8L56 20L52 38L56 52L46 58L42 50L22 50L18 58L8 52L12 38L8 20Z"
      fill="#141414"
      stroke="#3DDC10"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />

    {/* Armored Forehead Plate */}
    <polygon points="22,12 42,12 38,22 26,22" fill="#3DDC10" fillOpacity="0.4" stroke="#3DDC10" strokeWidth="1.5" />

    {/* Heavy Brow Ridge Over Eyes */}
    <path d="M16 26L32 30L48 26" stroke="#3DDC10" strokeWidth="2.5" strokeLinecap="round" />

    {/* Narrow Intense Eyes */}
    <polygon points="20,29 27,31 22,34" fill="#3DDC10" />
    <polygon points="44,29 37,31 42,34" fill="#3DDC10" />

    {/* Heavy Fortified Jawplate / Grate */}
    <rect x="22" y="38" width="20" height="10" rx="2" fill="#0A0A0A" stroke="#3DDC10" strokeWidth="1.5" />
    <line x1="27" y1="38" x2="27" y2="48" stroke="#3DDC10" strokeWidth="1.5" />
    <line x1="32" y1="38" x2="32" y2="48" stroke="#3DDC10" strokeWidth="1.5" />
    <line x1="37" y1="38" x2="37" y2="48" stroke="#3DDC10" strokeWidth="1.5" />
  </svg>
);
