import React from "react";

interface AlienProps {
  className?: string;
  animated?: boolean;
}

export const AlienXLR8: React.FC<AlienProps> = React.memo(({ className = "w-full h-full", animated = true }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="XLR8 Alien Transformation"
    >
      <defs>
        {/* Sleek Dark Body Gradient */}
        <linearGradient id="xlr8-body" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="50%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        {/* Cyan Speed Gradient */}
        <linearGradient id="xlr8-cyan" x1="30" y1="30" x2="70" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>

        {/* Visor Glow */}
        <filter id="xlr8-visor-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
      </defs>

      {/* Kinetic Speed Lines (Background) */}
      {animated && (
        <g opacity="0.65">
          <line x1="10" y1="25" x2="28" y2="25" stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1="6" y1="45" x2="30" y2="45" stroke="#00F0FF" strokeWidth="1.5" strokeDasharray="4 2" />
          <line x1="12" y1="65" x2="34" y2="65" stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="2 3" />
          <line x1="8" y1="80" x2="24" y2="80" stroke="#00F0FF" strokeWidth="1" strokeDasharray="3 2" />
        </g>
      )}

      {/* Velociraptor Tail (Extending Left) */}
      <path
        d="M36 68 Q18 64 6 52 Q18 56 38 60 Z"
        fill="url(#xlr8-body)"
        stroke="#00F0FF"
        strokeWidth="1"
      />
      {/* Cyan Tail Stripes */}
      <path d="M16 57 L14 62 M24 60 L22 65" stroke="#00F0FF" strokeWidth="1.2" />

      {/* Sleek Aerodynamic Torso */}
      <path
        d="M38 52 L62 48 L68 76 L44 80 Z"
        fill="url(#xlr8-body)"
        stroke="#1E293B"
        strokeWidth="1.5"
      />

      {/* Cyan Chevron Markings on Torso */}
      <polygon points="50,50 62,56 50,62 38,56" fill="url(#xlr8-cyan)" />
      <polygon points="50,64 58,68 50,72 42,68" fill="url(#xlr8-cyan)" />

      {/* High-Speed Wheeled Feet (Orbs) */}
      <circle cx="36" cy="90" r="5.5" fill="#0A0A0A" stroke="#00F0FF" strokeWidth="1.8" />
      <circle cx="36" cy="90" r="2" fill="#38BDF8" />
      <circle cx="64" cy="90" r="5.5" fill="#0A0A0A" stroke="#00F0FF" strokeWidth="1.8" />
      <circle cx="64" cy="90" r="2" fill="#38BDF8" />

      {/* Kineceleran Pointed Helmet (Iconic conical backward sweep) */}
      <path
        d="M20 20 C36 16 54 18 68 28 L78 38 L68 46 C54 50 36 46 20 20 Z"
        fill="url(#xlr8-body)"
        stroke="#00F0FF"
        strokeWidth="1.5"
      />

      {/* Cyan Helmet Stripe Crest */}
      <path
        d="M22 21 C36 19 50 21 64 30 L60 33 C48 26 34 24 22 21 Z"
        fill="#38BDF8"
      />

      {/* Sharp Chin & Jaw */}
      <polygon points="68,38 78,42 70,48 64,46" fill="#0F172A" stroke="#00F0FF" strokeWidth="1" />

      {/* Retractable Scanning Visor */}
      <path
        d="M62 32 L75 39 L71 44 L60 38 Z"
        fill="#0284C7"
        stroke="#00F0FF"
        strokeWidth="1.2"
      />

      {/* Dynamic Laser Eye Scan inside Visor */}
      <g className={animated ? "animate-alien-optic" : ""}>
        <line
          x1="66"
          y1="34"
          x2="72"
          y2="41"
          stroke="#00F0FF"
          strokeWidth="2.5"
          filter="url(#xlr8-visor-glow)"
        />
        <circle cx="69" cy="37.5" r="1.5" fill="#FFFFFF" />
      </g>

      {/* Omnitrix Chest Emblem */}
      <circle cx="50" cy="74" r="3.5" fill="#0A0A0A" stroke="#3DDC10" strokeWidth="1" />
      <circle cx="50" cy="74" r="1.5" fill="#3DDC10" />
    </svg>
  );
});

AlienXLR8.displayName = "AlienXLR8";
