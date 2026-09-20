import React from "react";

interface AlienProps {
  className?: string;
  animated?: boolean;
}

export const AlienWildmutt: React.FC<AlienProps> = React.memo(({ className = "w-full h-full", animated = true }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Wildmutt Alien Transformation"
    >
      <defs>
        {/* Feral Orange Beast Fur Gradient */}
        <linearGradient id="wildmutt-fur" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="45%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#9A3412" />
        </linearGradient>

        <linearGradient id="wildmutt-dark-fur" x1="50" y1="20" x2="50" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C2410C" />
          <stop offset="100%" stopColor="#7C2D12" />
        </linearGradient>
      </defs>

      <g className={animated ? "animate-alien-breathe" : ""}>
        {/* Muscular Canine Forequarters (Front Legs) */}
        {/* Left Front Leg & Claws */}
        <path d="M28 54 L16 68 L14 84 L24 84 L30 68 Z" fill="url(#wildmutt-dark-fur)" stroke="#7C2D12" strokeWidth="1.2" />
        <path d="M14 84 L10 90 M18 84 L16 90 M22 84 L22 90" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round" />

        {/* Right Front Leg & Claws */}
        <path d="M72 54 L84 68 L86 84 L76 84 L70 68 Z" fill="url(#wildmutt-dark-fur)" stroke="#7C2D12" strokeWidth="1.2" />
        <path d="M86 84 L90 90 M82 84 L84 90 M78 84 L78 90" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round" />

        {/* Feral Beast Torso & Back Hump */}
        <path
          d="M26 48 C24 38 34 32 50 32 C66 32 76 38 74 48 L76 74 C76 82 66 86 50 86 C34 86 24 82 24 74 Z"
          fill="url(#wildmutt-fur)"
          stroke="#7C2D12"
          strokeWidth="1.5"
        />

        {/* Back Spine Quills / Fur Tufts */}
        <path
          d="M44 32 L46 24 L48 32 M50 32 L52 22 L54 32 M56 32 L58 24 L60 32"
          stroke="#9A3412"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Vulpimancer Twitching Neck Sensory Quills (Left & Right) */}
        {/* Left Sensory Gills */}
        <g className={animated ? "animate-alien-quill" : ""}>
          <path d="M30 42 Q20 38 16 34" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M28 48 Q18 46 14 44" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M28 54 Q18 54 14 56" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        {/* Right Sensory Gills */}
        <g className={animated ? "animate-alien-quill" : ""}>
          <path d="M70 42 Q80 38 84 34" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M72 48 Q82 46 86 44" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M72 54 Q82 54 86 56" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Eyeless Snout & Head (Signature Vulpimancer trait: No Eyes, sensory perception) */}
        <path
          d="M34 28 C34 20 42 16 50 16 C58 16 66 20 66 28 L68 44 C66 48 60 52 50 52 C40 52 34 48 32 44 Z"
          fill="url(#wildmutt-fur)"
          stroke="#7C2D12"
          strokeWidth="1.5"
        />

        {/* Snout Wrinkles & Scent Receptors */}
        <path d="M42 24 Q50 22 58 24 M40 28 Q50 26 60 28 M42 32 Q50 30 58 32" stroke="#7C2D12" strokeWidth="1.2" strokeLinecap="round" />

        {/* Black Snout Lip & Gaping Canine Jaws */}
        <path
          d="M36 40 C42 44 58 44 64 40 L62 48 C56 52 44 52 38 48 Z"
          fill="#450A0A"
          stroke="#0A0A0A"
          strokeWidth="1.2"
        />

        {/* Sharp White Canine Fangs */}
        {/* Upper Fangs */}
        <polygon points="40,40 43,45 42,40" fill="#FFFFFF" />
        <polygon points="45,41 47,46 48,41" fill="#FFFFFF" />
        <polygon points="52,41 53,46 55,41" fill="#FFFFFF" />
        <polygon points="58,40 57,45 60,40" fill="#FFFFFF" />
        {/* Prominent Outer Sabers */}
        <polygon points="38,40 40,48 42,40" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
        <polygon points="62,40 60,48 58,40" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />

        {/* Lower Fangs */}
        <polygon points="42,48 44,44 46,48" fill="#FFFFFF" />
        <polygon points="54,48 56,44 58,48" fill="#FFFFFF" />

        {/* Omnitrix Themed Collar / Shoulder Harness */}
        <path d="M40 66 L50 70 L60 66 L58 74 L50 78 L42 74 Z" fill="#0A0A0A" stroke="#27272A" strokeWidth="1" />
        <circle cx="50" cy="71" r="3.5" fill="#0A0A0A" stroke="#3DDC10" strokeWidth="1.2" />
        <polygon points="48,69 52,69 50,71" fill="#3DDC10" />
        <polygon points="48,73 52,73 50,71" fill="#3DDC10" />
      </g>
    </svg>
  );
});

AlienWildmutt.displayName = "AlienWildmutt";
