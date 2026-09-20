import React from "react";

interface AlienProps {
  className?: string;
  animated?: boolean;
}

export const AlienHeatblast: React.FC<AlienProps> = React.memo(({ className = "w-full h-full", animated = true }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Heatblast Alien Transformation"
    >
      <defs>
        {/* Magma Body Gradient */}
        <linearGradient id="heatblast-rock" x1="20" y1="30" x2="80" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#451A03" />
          <stop offset="50%" stopColor="#271106" />
          <stop offset="100%" stopColor="#140803" />
        </linearGradient>

        {/* Flame Core Gradient */}
        <linearGradient id="heatblast-flame-core" x1="50" y1="5" x2="50" y2="45" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="25%" stopColor="#FEF08A" />
          <stop offset="60%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>

        {/* Outer Flame Gradient */}
        <linearGradient id="heatblast-flame-outer" x1="50" y1="0" x2="50" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="40%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>

        {/* Lava Veins Glow */}
        <filter id="magma-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
      </defs>

      {/* Floating Fiery Embers */}
      {animated && (
        <g className="animate-alien-ember">
          <circle cx="34" cy="22" r="1.2" fill="#FEF08A" opacity="0.9" />
          <circle cx="66" cy="18" r="1" fill="#F97316" opacity="0.8" />
          <circle cx="48" cy="12" r="1.4" fill="#FFFBEB" opacity="0.95" />
          <circle cx="58" cy="8" r="0.8" fill="#F59E0B" opacity="0.7" />
        </g>
      )}

      {/* Fiery Crown (Multi-tiered animated flames) */}
      <g className={animated ? "animate-alien-flame" : ""}>
        {/* Back Flame Crown */}
        <path
          d="M32 38 C28 26 34 16 42 12 C44 20 46 22 50 8 C54 20 57 18 60 14 C68 18 72 26 68 38 Z"
          fill="url(#heatblast-flame-outer)"
          opacity="0.85"
        />
        {/* Core Main Flame */}
        <path
          d="M36 38 C32 28 38 20 45 16 C47 22 49 24 50 14 C52 24 54 22 56 18 C62 22 66 28 64 38 Z"
          fill="url(#heatblast-flame-core)"
        />
      </g>

      {/* Rock Collar / Shoulders */}
      <path
        d="M20 78 L26 56 L38 58 L50 62 L62 58 L74 56 L80 78 L72 88 L50 92 L28 88 Z"
        fill="url(#heatblast-rock)"
        stroke="#78350F"
        strokeWidth="1.5"
      />

      {/* Magma Cracks across Shoulders */}
      <path
        d="M28 66 L38 72 L44 68 M62 68 L56 74 L72 70 M50 62 L50 78"
        stroke="#F97316"
        strokeWidth="1.8"
        strokeLinecap="round"
        filter="url(#magma-glow)"
      />

      {/* Magma Head (Charcoal Obsidian Crags) */}
      <path
        d="M34 38 C33 34 37 30 50 30 C63 30 67 34 66 38 L68 50 C67 56 61 60 50 60 C39 60 33 56 32 50 Z"
        fill="url(#heatblast-rock)"
        stroke="#9A3412"
        strokeWidth="1.5"
      />

      {/* Molten Facial Cracks */}
      <path
        d="M38 42 L42 46 L39 52 M62 42 L58 46 L61 52 M50 32 L50 38"
        stroke="#F59E0B"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Fiery Glowing Eyes */}
      <polygon points="40,43 46,45 44,48 39,46" fill="#FFFBEB" filter="url(#magma-glow)" />
      <polygon points="60,43 54,45 56,48 61,46" fill="#FFFBEB" filter="url(#magma-glow)" />

      {/* Core Omnitrix Themed Chest Plate Accent */}
      <polygon points="50,72 55,78 50,84 45,78" fill="#0A0A0A" stroke="#3DDC10" strokeWidth="1" />
      <circle cx="50" cy="78" r="1.5" fill="#3DDC10" />
    </svg>
  );
});

AlienHeatblast.displayName = "AlienHeatblast";
