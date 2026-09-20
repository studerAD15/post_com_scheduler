import React from "react";

export const AlienAero: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Aero-Talon - Flight Aero Raptor Alien"
  >
    {/* Swept-Back Wing Crest Feathers */}
    <path d="M32 4L42 16L32 14L22 16L32 4Z" fill="#3DDC10" fillOpacity="0.4" stroke="#3DDC10" strokeWidth="1.5" />
    <path d="M16 12L28 20L18 22L12 16L16 12Z" fill="#141414" stroke="#3DDC10" strokeWidth="1.5" />
    <path d="M48 12L36 20L46 22L52 16L48 12Z" fill="#141414" stroke="#3DDC10" strokeWidth="1.5" />

    {/* Avian Head Outline */}
    <path
      d="M20 22C24 16 40 16 44 22C50 30 48 42 42 48L32 60L22 48C16 42 14 30 20 22Z"
      fill="#141414"
      stroke="#3DDC10"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Raptor Beak Point */}
    <polygon points="32,42 38,48 32,58 26,48" fill="#3DDC10" />

    {/* Hawk-Eye Visors */}
    <path
      d="M22 30C26 28 30 32 30 32C28 36 24 36 22 30Z"
      fill="#3DDC10"
      stroke="#3DDC10"
      strokeWidth="1"
    />
    <path
      d="M42 30C38 28 34 32 34 32C36 36 40 36 42 30Z"
      fill="#3DDC10"
      stroke="#3DDC10"
      strokeWidth="1"
    />

    {/* Aerodynamic Forehead Stripe */}
    <line x1="32" y1="18" x2="32" y2="36" stroke="#3DDC10" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
