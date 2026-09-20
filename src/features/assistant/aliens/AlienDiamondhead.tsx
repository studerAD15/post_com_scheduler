import React from "react";

interface AlienProps {
  className?: string;
  animated?: boolean;
}

export const AlienDiamondhead: React.FC<AlienProps> = React.memo(({ className = "w-full h-full", animated = true }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Diamondhead Alien Transformation"
    >
      <defs>
        {/* Crystal Facet Shading */}
        <linearGradient id="dh-facet-main" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A5F3FC" />
          <stop offset="35%" stopColor="#22D3EE" />
          <stop offset="70%" stopColor="#0891B2" />
          <stop offset="100%" stopColor="#164E63" />
        </linearGradient>

        <linearGradient id="dh-facet-light" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ECFEFF" />
          <stop offset="60%" stopColor="#67E8F9" />
          <stop offset="100%" stopColor="#0E7490" />
        </linearGradient>

        <linearGradient id="dh-facet-dark" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0891B2" />
          <stop offset="100%" stopColor="#083344" />
        </linearGradient>

        {/* Shimmer Light Beam Gradient */}
        <linearGradient id="dh-shimmer-beam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Clip mask for shimmer sweep */}
        <clipPath id="dh-body-clip">
          <path d="M50 12 L64 34 L72 32 L84 52 L68 84 L50 92 L32 84 L16 52 L28 32 L36 34 Z" />
        </clipPath>
      </defs>

      {/* Massive Back Crystal Shards (Petrosapien Back Spikes) */}
      <g>
        {/* Far Left Shard */}
        <polygon points="26,42 12,18 24,34 32,46" fill="url(#dh-facet-dark)" stroke="#A5F3FC" strokeWidth="1" />
        {/* Main Left Shard */}
        <polygon points="34,36 22,8 36,28 42,42" fill="url(#dh-facet-light)" stroke="#E0F2FE" strokeWidth="1" />
        {/* Far Right Shard */}
        <polygon points="74,42 88,18 76,34 68,46" fill="url(#dh-facet-dark)" stroke="#A5F3FC" strokeWidth="1" />
        {/* Main Right Shard */}
        <polygon points="66,36 78,8 64,28 58,42" fill="url(#dh-facet-light)" stroke="#E0F2FE" strokeWidth="1" />
      </g>

      {/* Crystalline Torso */}
      <polygon
        points="32,54 50,48 68,54 62,84 50,92 38,84"
        fill="url(#dh-facet-main)"
        stroke="#67E8F9"
        strokeWidth="1.2"
      />

      {/* Black & White Combat Trim */}
      <polygon points="46,50 54,50 52,86 48,86" fill="#0A0A0A" />
      <polygon points="48,50 52,50 51,84 49,84" fill="#F8FAFC" />

      {/* Crystalline Trapezius & Neck */}
      <polygon points="36,44 50,48 64,44 62,56 50,60 38,56" fill="url(#dh-facet-dark)" />

      {/* Chiseled Crystal Head */}
      <polygon
        points="50,14 62,26 58,44 50,50 42,44 38,26"
        fill="url(#dh-facet-main)"
        stroke="#E0F2FE"
        strokeWidth="1.5"
      />

      {/* Crystal Crown Top Facets */}
      <polygon points="50,14 56,26 50,32 44,26" fill="url(#dh-facet-light)" />

      {/* Left Cheek Facet */}
      <polygon points="38,26 44,26 42,44 36,36" fill="url(#dh-facet-dark)" />

      {/* Right Cheek Facet */}
      <polygon points="62,26 56,26 58,44 64,36" fill="url(#dh-facet-light)" />

      {/* Chiseled Pointed Jaw */}
      <polygon points="42,44 50,50 58,44 50,47" fill="url(#dh-facet-dark)" stroke="#67E8F9" strokeWidth="1" />

      {/* Sharp Yellow Glowing Eyes */}
      <polygon points="43,30 48,31 47,34 42,32" fill="#FDE047" stroke="#CA8A04" strokeWidth="0.5" />
      <polygon points="57,30 52,31 53,34 58,32" fill="#FDE047" stroke="#CA8A04" strokeWidth="0.5" />

      {/* Shimmer Light Glint (Sweeping Refraction) */}
      {animated && (
        <g clipPath="url(#dh-body-clip)">
          <rect
            x="-50"
            y="-50"
            width="200"
            height="30"
            fill="url(#dh-shimmer-beam)"
            className="animate-alien-shimmer pointer-events-none"
          />
        </g>
      )}

      {/* Omnitrix Emblem on Left Chest / Center */}
      <circle cx="50" cy="68" r="4" fill="#0A0A0A" stroke="#3DDC10" strokeWidth="1.2" />
      <circle cx="50" cy="68" r="2" fill="#3DDC10" />
    </svg>
  );
});

AlienDiamondhead.displayName = "AlienDiamondhead";
