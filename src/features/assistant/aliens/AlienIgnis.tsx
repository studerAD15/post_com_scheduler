import React from "react";

export const AlienIgnis: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Pyros - Fire Elemental Alien"
  >
    {/* Outer Magma Silhouette */}
    <path
      d="M32 4L39 18L50 14L45 28L56 36L44 44L48 58L32 50L16 58L20 44L8 36L19 28L14 14L25 18L32 4Z"
      fill="#141414"
      stroke="#3DDC10"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Inner Molten Core */}
    <path
      d="M32 14L37 24L46 26L39 34L41 43L32 38L23 43L25 34L18 26L27 24L32 14Z"
      fill="#3DDC10"
      fillOpacity="0.25"
      stroke="#3DDC10"
      strokeWidth="1.5"
    />
    {/* Jagged Brow & Blazing Slit Eyes */}
    <polygon points="22,30 30,32 23,34" fill="#3DDC10" />
    <polygon points="42,30 34,32 41,34" fill="#3DDC10" />
    {/* Central Plasma Vent */}
    <circle cx="32" cy="42" r="2.5" fill="#3DDC10" />
    <line x1="32" y1="36" x2="32" y2="40" stroke="#3DDC10" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
