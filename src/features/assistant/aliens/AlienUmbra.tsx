import React from "react";

export const AlienUmbra: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Umbra-Wraith - Stealth Shadow Phantom Alien"
  >
    {/* Ethereal Hood / Shroud Silhouette */}
    <path
      d="M32 4C20 4 14 14 12 26C10 38 8 50 6 60C14 54 22 56 32 50C42 56 50 54 58 60C56 50 54 38 52 26C50 14 44 4 32 4Z"
      fill="#141414"
      stroke="#3DDC10"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Deep Hood Recess */}
    <path
      d="M32 14C24 14 18 22 18 34C18 44 24 48 32 48C40 48 46 44 46 34C46 22 40 14 32 14Z"
      fill="#0A0A0A"
      stroke="#3DDC10"
      strokeWidth="1.5"
    />

    {/* Glowing Single Core Cyclops / Phantom Eye */}
    <ellipse cx="32" cy="30" rx="7" ry="4" fill="#3DDC10" />
    <ellipse cx="32" cy="30" rx="3" ry="2" fill="#0A0A0A" />

    {/* Shadow Wisp Wisps */}
    <path d="M26 40C28 44 30 42 32 44C34 42 36 44 38 40" stroke="#3DDC10" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
