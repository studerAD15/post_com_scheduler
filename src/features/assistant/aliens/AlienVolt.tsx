import React from "react";

export const AlienVolt: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Volt-Surge - Electric Tesla Dynamo Alien"
  >
    {/* Twin Lightning Bolt Conductor Horns */}
    <path
      d="M18 18L14 4L24 12L20 18M46 18L50 4L40 12L44 18"
      fill="#3DDC10"
      stroke="#3DDC10"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />

    {/* Angular Electric Helmet Mask */}
    <path
      d="M20 18L32 12L44 18L50 32L46 50L32 58L18 50L14 32L20 18Z"
      fill="#141414"
      stroke="#3DDC10"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Zigzag Lightning Visor */}
    <path
      d="M18 32L26 30L30 35L34 30L38 35L46 32L42 38L36 36L34 40L30 36L22 38L18 32Z"
      fill="#3DDC10"
      stroke="#3DDC10"
      strokeWidth="1"
    />

    {/* Central Power Node */}
    <circle cx="32" cy="22" r="3" fill="#3DDC10" fillOpacity="0.8" />
    <path d="M26 48L32 44L38 48" stroke="#3DDC10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
