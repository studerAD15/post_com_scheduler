import React from "react";

export const AlienFlora: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Flora-Viper - Bio-Thorn Plant Alien"
  >
    {/* Bramble Vine Crown Spikes */}
    <path d="M32 6L36 18L32 14L28 18L32 6Z" fill="#3DDC10" />
    <path d="M18 12L26 22L20 20L18 12Z" fill="#3DDC10" />
    <path d="M46 12L44 20L38 22L46 12Z" fill="#3DDC10" />

    {/* Organic Pod Head Frame */}
    <path
      d="M20 22C20 16 44 16 44 22C52 28 50 44 42 54C36 60 28 60 22 54C14 44 12 28 20 22Z"
      fill="#141414"
      stroke="#3DDC10"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Leaf-Blade Slit Eyes */}
    <path
      d="M22 34C26 31 30 35 28 38C25 38 22 37 22 34Z"
      fill="#3DDC10"
    />
    <path
      d="M42 34C38 31 34 35 36 38C39 38 42 37 42 34Z"
      fill="#3DDC10"
    />

    {/* Intertwined Root Tendril Mask */}
    <path
      d="M26 44C30 48 34 48 38 44"
      stroke="#3DDC10"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M32 38L32 50"
      stroke="#3DDC10"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="32" cy="52" r="2" fill="#3DDC10" />
  </svg>
);
