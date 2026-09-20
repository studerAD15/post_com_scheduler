import React from "react";

interface AlienProps {
  className?: string;
  animated?: boolean;
}

export const AlienUpgrade: React.FC<AlienProps> = React.memo(({ className = "w-full h-full", animated = true }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Upgrade Alien Transformation"
    >
      <defs>
        {/* Deep Nano-Metallic Body */}
        <linearGradient id="upgrade-body" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#18181B" />
          <stop offset="60%" stopColor="#09090B" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>

        {/* Neon Green Circuit Glow */}
        <filter id="upgrade-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Smooth Techno-Organic Humanoid Silhouette */}
      <path
        d="M50 14 C40 14 36 22 36 34 C36 44 42 48 40 54 C36 62 26 66 22 84 C32 88 44 90 50 90 C56 90 68 88 78 84 C74 66 64 62 60 54 C58 48 64 44 64 34 C64 22 60 14 50 14 Z"
        fill="url(#upgrade-body)"
        stroke="#27272A"
        strokeWidth="1.5"
      />

      {/* Circuit Trace Bus Lines (Background Tracks) */}
      <g stroke="#166534" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Head Circuits */}
        <path d="M50 16 L50 24 M42 20 L42 28 L46 32 M58 20 L58 28 L54 32" />
        {/* Neck to Shoulder Bus */}
        <path d="M40 50 L30 56 L24 72 M60 50 L70 56 L76 72" />
        {/* Torso Grid */}
        <path d="M50 48 L50 68 M44 58 L56 58 M42 74 L58 74" />
        {/* Lateral Nodes */}
        <path d="M34 68 L44 68 M66 68 L56 68" />
      </g>

      {/* Animated Flowing Neon Green Circuits (Electrical Current Pulses) */}
      <g
        stroke="#3DDC10"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#upgrade-glow)"
        className={animated ? "animate-alien-circuit" : ""}
      >
        {/* Primary Vertical Spine Bus */}
        <path d="M50 16 L50 25 M50 46 L50 78 M50 80 L50 88" />
        {/* Left Neural Branch */}
        <path d="M42 22 L42 29 L46 33 M38 52 L30 57 L24 73" />
        {/* Right Neural Branch */}
        <path d="M58 22 L58 29 L54 33 M62 52 L70 57 L76 73" />
        {/* Horizontal Interconnects */}
        <path d="M44 62 L56 62 M40 70 L60 70 M36 78 L64 78" />
      </g>

      {/* Circuit Nodes (Junction Points) */}
      <g fill="#3DDC10" filter="url(#upgrade-glow)">
        <circle cx="50" cy="25" r="1.8" />
        <circle cx="46" cy="33" r="1.5" />
        <circle cx="54" cy="33" r="1.5" />
        <circle cx="30" cy="57" r="1.8" />
        <circle cx="70" cy="57" r="1.8" />
        <circle cx="24" cy="73" r="1.6" />
        <circle cx="76" cy="73" r="1.6" />
        <circle cx="44" cy="62" r="1.5" />
        <circle cx="56" cy="62" r="1.5" />
      </g>

      {/* Iconic Concentric Optic Eye Core (Galvanic Mechamorph Eye) */}
      <g className={animated ? "animate-alien-breathe" : ""}>
        {/* Outer Ring */}
        <circle cx="50" cy="37" r="7.5" fill="#09090B" stroke="#3DDC10" strokeWidth="2" filter="url(#upgrade-glow)" />
        {/* Middle Pulse Ring */}
        <circle cx="50" cy="37" r="4.5" fill="#14532D" stroke="#4ADE80" strokeWidth="1.2" />
        {/* Center Optical Pupil */}
        <circle cx="50" cy="37" r="2.2" fill="#DCFCE7" />
      </g>

      {/* Omnitrix Chest Emblem */}
      <circle cx="50" cy="80" r="4" fill="#09090B" stroke="#3DDC10" strokeWidth="1.2" />
      <circle cx="50" cy="80" r="1.8" fill="#3DDC10" />
    </svg>
  );
});

AlienUpgrade.displayName = "AlienUpgrade";
