import React from "react";

export const AlienVelo: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Velo-Sprint - Speed Insectoid Alien"
  >
    {/* Twin Aerodynamic Antennae */}
    <path d="M22 22L12 8M42 22L52 8" stroke="#3DDC10" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="11" cy="7" r="2.5" fill="#3DDC10" />
    <circle cx="53" cy="7" r="2.5" fill="#3DDC10" />

    {/* Streamlined Helmet / Head Shell */}
    <path
      d="M32 8C20 8 16 22 16 38C16 50 24 58 32 60C40 58 48 50 48 38C48 22 44 8 32 8Z"
      fill="#141414"
      stroke="#3DDC10"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Aerodynamic Speed Visor (Horizontal Chevron) */}
    <path
      d="M18 34L32 40L46 34L44 26L32 30L20 26L18 34Z"
      fill="#3DDC10"
      fillOpacity="0.85"
      stroke="#3DDC10"
      strokeWidth="1.5"
    />

    {/* Speed Decals on Jaw */}
    <path d="M26 48L32 53L38 48" stroke="#3DDC10" strokeWidth="2" strokeLinecap="round" />
    <path d="M28 44L32 48L36 44" stroke="#3DDC10" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
