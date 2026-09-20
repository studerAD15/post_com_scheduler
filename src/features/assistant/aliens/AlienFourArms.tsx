import React from "react";

interface AlienProps {
  className?: string;
  animated?: boolean;
}

export const AlienFourArms: React.FC<AlienProps> = React.memo(({ className = "w-full h-full", animated = true }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Four Arms Alien Transformation"
    >
      <defs>
        {/* Red Muscular Skin Gradient */}
        <linearGradient id="fourarms-skin" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="50%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>

        <linearGradient id="fourarms-dark-skin" x1="50" y1="20" x2="50" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#7F1D1D" />
        </linearGradient>

        {/* Eye Glow */}
        <filter id="fourarms-eye-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
      </defs>

      <g className={animated ? "animate-alien-breathe" : ""}>
        {/* Lower Left Arm (Arm 3) */}
        <path
          d="M26 62 L12 68 L10 78 L18 80 L28 72 Z"
          fill="url(#fourarms-dark-skin)"
          stroke="#7F1D1D"
          strokeWidth="1.2"
        />
        {/* Lower Left Fist */}
        <circle cx="12" cy="80" r="4.5" fill="#DC2626" stroke="#450A0A" strokeWidth="1" />

        {/* Lower Right Arm (Arm 4) */}
        <path
          d="M74 62 L88 68 L90 78 L82 80 L72 72 Z"
          fill="url(#fourarms-dark-skin)"
          stroke="#7F1D1D"
          strokeWidth="1.2"
        />
        {/* Lower Right Fist */}
        <circle cx="88" cy="80" r="4.5" fill="#DC2626" stroke="#450A0A" strokeWidth="1" />

        {/* Upper Left Arm (Arm 1) */}
        <path
          d="M32 46 L16 42 L8 50 L14 58 L28 54 Z"
          fill="url(#fourarms-skin)"
          stroke="#7F1D1D"
          strokeWidth="1.4"
        />
        {/* Upper Left Fist */}
        <circle cx="10" cy="52" r="5" fill="#EF4444" stroke="#450A0A" strokeWidth="1.2" />

        {/* Upper Right Arm (Arm 2) */}
        <path
          d="M68 46 L84 42 L92 50 L86 58 L72 54 Z"
          fill="url(#fourarms-skin)"
          stroke="#7F1D1D"
          strokeWidth="1.4"
        />
        {/* Upper Right Fist */}
        <circle cx="90" cy="52" r="5" fill="#EF4444" stroke="#450A0A" strokeWidth="1.2" />

        {/* Massive Muscular Torso */}
        <path
          d="M28 44 L32 78 L50 86 L68 78 L72 44 L50 40 Z"
          fill="url(#fourarms-skin)"
          stroke="#7F1D1D"
          strokeWidth="1.5"
        />

        {/* Black & White Combat T-Stripe Suit */}
        <path d="M38 43 L36 78 L42 82 L42 54 L58 54 L58 82 L64 78 L62 43 Z" fill="#0A0A0A" />
        <path d="M44 41 L44 83 L56 83 L56 41 Z" fill="#F8FAFC" />
        <line x1="50" y1="41" x2="50" y2="83" stroke="#0A0A0A" strokeWidth="2.5" />

        {/* Massive Red Jaw & Trapezius */}
        <path d="M35 34 L38 44 L50 48 L62 44 L65 34 Z" fill="url(#fourarms-dark-skin)" />

        {/* Head */}
        <path
          d="M37 22 C37 14 43 10 50 10 C57 10 63 14 63 22 L62 34 C60 38 56 40 50 40 C44 40 40 38 38 34 Z"
          fill="url(#fourarms-skin)"
          stroke="#7F1D1D"
          strokeWidth="1.5"
        />

        {/* Black Head Ridge / Mohawk Stripe */}
        <path d="M48 10 L52 10 L52 30 L48 30 Z" fill="#0A0A0A" />

        {/* 4 Golden Glowing Eyes (Tetramand Signature) */}
        {/* Upper Pair */}
        <circle cx="43" cy="22" r="2.2" fill="#FBBF24" filter="url(#fourarms-eye-glow)" />
        <circle cx="57" cy="22" r="2.2" fill="#FBBF24" filter="url(#fourarms-eye-glow)" />
        <circle cx="43" cy="22" r="0.8" fill="#0A0A0A" />
        <circle cx="57" cy="22" r="0.8" fill="#0A0A0A" />

        {/* Lower Pair */}
        <circle cx="44" cy="27" r="1.8" fill="#FBBF24" filter="url(#fourarms-eye-glow)" />
        <circle cx="56" cy="27" r="1.8" fill="#FBBF24" filter="url(#fourarms-eye-glow)" />
        <circle cx="44" cy="27" r="0.6" fill="#0A0A0A" />
        <circle cx="56" cy="27" r="0.6" fill="#0A0A0A" />

        {/* Severe Brow & Grimace */}
        <path d="M41 19 L47 21 M59 19 L53 21" stroke="#0A0A0A" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M45 33 L55 33" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" />

        {/* Omnitrix Chest Emblem */}
        <circle cx="50" cy="62" r="4.5" fill="#0A0A0A" stroke="#3DDC10" strokeWidth="1.2" />
        <polygon points="48,60 52,60 50,62" fill="#3DDC10" />
        <polygon points="48,64 52,64 50,62" fill="#3DDC10" />
      </g>
    </svg>
  );
});

AlienFourArms.displayName = "AlienFourArms";
