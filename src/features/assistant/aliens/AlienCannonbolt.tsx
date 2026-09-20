import React from "react";

interface AlienProps {
  className?: string;
  animated?: boolean;
}

export const AlienCannonbolt: React.FC<AlienProps> = React.memo(({ className = "w-full h-full", animated = true }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Cannonbolt Alien Transformation"
    >
      <defs>
        {/* Yellow Carapace Gradient */}
        <linearGradient id="cannonbolt-shell" x1="20" y1="10" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="40%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        {/* White Armored Hide */}
        <linearGradient id="cannonbolt-hide" x1="30" y1="30" x2="70" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>

      <g className={animated ? "animate-alien-breathe" : ""}>
        {/* Massive Spherical Back Shell (Arburian Pelarota Carapace) */}
        <ellipse
          cx="50"
          cy="52"
          rx="44"
          ry="38"
          fill="url(#cannonbolt-shell)"
          stroke="#78350F"
          strokeWidth="2"
        />

        {/* Shell Armor Segment Plates (Upper Curved Plates) */}
        <path
          d="M16 44 C26 22 74 22 84 44 C72 32 28 32 16 44 Z"
          fill="#FBBF24"
          stroke="#B45309"
          strokeWidth="1.2"
        />

        {/* Shoulder Armor Spheres (Left & Right) */}
        <circle cx="20" cy="50" r="10" fill="url(#cannonbolt-shell)" stroke="#78350F" strokeWidth="1.5" />
        <circle cx="20" cy="50" r="5" fill="#B45309" opacity="0.6" />

        <circle cx="80" cy="50" r="10" fill="url(#cannonbolt-shell)" stroke="#78350F" strokeWidth="1.5" />
        <circle cx="80" cy="50" r="5" fill="#B45309" opacity="0.6" />

        {/* Thick White Muscular Forearms & Claws */}
        {/* Left Arm & Claws */}
        <path d="M22 56 L12 68 L16 78 L26 72 Z" fill="url(#cannonbolt-hide)" stroke="#475569" strokeWidth="1.2" />
        <path d="M10 74 L8 80 M13 77 L12 83 M17 76 L18 82" stroke="#0A0A0A" strokeWidth="1.6" strokeLinecap="round" />

        {/* Right Arm & Claws */}
        <path d="M78 56 L88 68 L84 78 L74 72 Z" fill="url(#cannonbolt-hide)" stroke="#475569" strokeWidth="1.2" />
        <path d="M90 74 L92 80 M87 77 L88 83 M83 76 L82 82" stroke="#0A0A0A" strokeWidth="1.6" strokeLinecap="round" />

        {/* White Armored Torso / Underbelly */}
        <path
          d="M32 46 C32 38 40 34 50 34 C60 34 68 38 68 46 L66 76 C66 84 58 88 50 88 C42 88 34 84 34 76 Z"
          fill="url(#cannonbolt-hide)"
          stroke="#475569"
          strokeWidth="1.5"
        />

        {/* Black Armor Stripe Division */}
        <path d="M42 46 L42 86 L58 86 L58 46 Z" fill="#0A0A0A" opacity="0.9" />
        <path d="M46 48 L46 84 L54 84 L54 48 Z" fill="#F8FAFC" />

        {/* Bulky Head (Sunk into Carapace) */}
        <path
          d="M38 28 C38 20 44 18 50 18 C56 18 62 20 62 28 L60 38 C58 40 54 42 50 42 C46 42 42 40 40 38 Z"
          fill="url(#cannonbolt-hide)"
          stroke="#475569"
          strokeWidth="1.4"
        />

        {/* Yellow Forehead Armor Plating */}
        <path d="M42 20 C46 18 54 18 58 20 L56 26 L44 26 Z" fill="url(#cannonbolt-shell)" stroke="#B45309" strokeWidth="1" />

        {/* Green Glowing Eyes */}
        <circle cx="45" cy="30" r="2.2" fill="#3DDC10" />
        <circle cx="55" cy="30" r="2.2" fill="#3DDC10" />
        <circle cx="45" cy="30" r="0.8" fill="#0A0A0A" />
        <circle cx="55" cy="30" r="0.8" fill="#0A0A0A" />

        {/* Stern Brow & Teeth */}
        <path d="M43 27 L48 29 M57 27 L52 29" stroke="#0A0A0A" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M47 37 L53 37" stroke="#0A0A0A" strokeWidth="1.2" strokeLinecap="round" />

        {/* Omnitrix Chest Emblem */}
        <circle cx="50" cy="62" r="4.5" fill="#0A0A0A" stroke="#3DDC10" strokeWidth="1.2" />
        <polygon points="48,60 52,60 50,62" fill="#3DDC10" />
        <polygon points="48,64 52,64 50,62" fill="#3DDC10" />
      </g>
    </svg>
  );
});

AlienCannonbolt.displayName = "AlienCannonbolt";
