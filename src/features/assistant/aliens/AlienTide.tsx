import React from "react";

export const AlienTide: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Abyss-Fin - Deep Sea Aquatic Predator Alien"
  >
    {/* Dorsal Fin Crown */}
    <path
      d="M32 4C36 12 44 16 46 22L32 20L18 22C20 16 28 12 32 4Z"
      fill="#3DDC10"
      fillOpacity="0.3"
      stroke="#3DDC10"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Aquatic Predator Head Frame */}
    <path
      d="M14 26C14 26 22 22 32 22C42 22 50 26 50 26C54 36 52 48 44 56C36 62 28 62 20 56C12 48 10 36 14 26Z"
      fill="#141414"
      stroke="#3DDC10"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Lateral Gill Slits */}
    <path d="M16 38C20 39 20 45 16 46" stroke="#3DDC10" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M48 38C44 39 44 45 48 46" stroke="#3DDC10" strokeWidth="1.5" strokeLinecap="round" />

    {/* Luminescent Wave Visor */}
    <path
      d="M20 34C24 32 28 36 32 34C36 36 40 32 44 34C42 38 38 40 32 40C26 40 22 38 20 34Z"
      fill="#3DDC10"
      stroke="#3DDC10"
      strokeWidth="1.5"
    />

    {/* Ventral Breathing Vent */}
    <path d="M26 48C30 51 34 51 38 48" stroke="#3DDC10" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
