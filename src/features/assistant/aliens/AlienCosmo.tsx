import React from "react";

export const AlienCosmo: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Cosmo-Mind - Psychic Cosmic Mind Alien"
  >
    {/* Astral Energy Orbit Rings */}
    <ellipse cx="32" cy="18" rx="26" ry="7" stroke="#3DDC10" strokeWidth="1.5" strokeDasharray="3 3" />
    <ellipse cx="32" cy="24" rx="20" ry="5" stroke="#3DDC10" strokeWidth="1" opacity="0.7" />

    {/* Large Psionic Cranium */}
    <path
      d="M32 8C18 8 14 20 16 34C18 44 24 54 32 58C40 54 46 44 48 34C50 20 46 8 32 8Z"
      fill="#141414"
      stroke="#3DDC10"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Third Eye / Psionic Energy Diamond */}
    <polygon points="32,16 37,23 32,30 27,23" fill="#3DDC10" />

    {/* Telepathic Eyes */}
    <ellipse cx="23" cy="36" rx="4" ry="2.5" fill="#3DDC10" />
    <ellipse cx="41" cy="36" rx="4" ry="2.5" fill="#3DDC10" />

    {/* Cosmic Neural Circuit Lines */}
    <path d="M32 32L32 46" stroke="#3DDC10" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M26 44L32 48L38 44" stroke="#3DDC10" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
