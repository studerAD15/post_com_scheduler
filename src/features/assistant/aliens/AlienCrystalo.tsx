import React from "react";

export const AlienCrystalo: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Geo-Shard - Crystal Prismatic Alien"
  >
    {/* Upper Crystal Spire Crest */}
    <polygon points="32,4 40,20 24,20" fill="#3DDC10" fillOpacity="0.4" stroke="#3DDC10" strokeWidth="2" />
    <polygon points="40,16 52,24 38,26" fill="#141414" stroke="#3DDC10" strokeWidth="1.5" />
    <polygon points="24,16 12,24 26,26" fill="#141414" stroke="#3DDC10" strokeWidth="1.5" />

    {/* Faceted Head Outline */}
    <path
      d="M16 26L32 20L48 26L52 42L42 56L32 60L22 56L12 42L16 26Z"
      fill="#141414"
      stroke="#3DDC10"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Facet Edge Intersections */}
    <line x1="32" y1="20" x2="32" y2="44" stroke="#3DDC10" strokeWidth="1.5" />
    <line x1="16" y1="26" x2="32" y2="34" stroke="#3DDC10" strokeWidth="1.5" />
    <line x1="48" y1="26" x2="32" y2="34" stroke="#3DDC10" strokeWidth="1.5" />
    <line x1="12" y1="42" x2="32" y2="44" stroke="#3DDC10" strokeWidth="1.5" />
    <line x1="52" y1="42" x2="32" y2="44" stroke="#3DDC10" strokeWidth="1.5" />

    {/* Prismatic Eyes */}
    <polygon points="22,32 28,34 24,38" fill="#3DDC10" />
    <polygon points="42,32 36,34 40,38" fill="#3DDC10" />

    {/* Chin Diamond */}
    <polygon points="32,48 36,54 32,58 28,54" fill="#3DDC10" fillOpacity="0.8" />
  </svg>
);
