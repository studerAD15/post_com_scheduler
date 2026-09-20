import React from "react";

interface AlienProps {
  className?: string;
  animated?: boolean;
}

export const AlienRipjaws: React.FC<AlienProps> = React.memo(({ className = "w-full h-full", animated = true }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Ripjaws Alien Transformation"
    >
      <defs>
        {/* Piscine Skin Gradient */}
        <linearGradient id="ripjaws-skin" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0E7490" />
          <stop offset="50%" stopColor="#155E75" />
          <stop offset="100%" stopColor="#164E63" />
        </linearGradient>

        <linearGradient id="ripjaws-underbelly" x1="50" y1="30" x2="50" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#CFFAFE" />
          <stop offset="50%" stopColor="#A5F3FC" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>

        {/* Bioluminescent Lure Glow */}
        <filter id="angler-lure-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
      </defs>

      {/* Dorsal Fin & Spines (Background) */}
      <path
        d="M50 18 L50 4 L56 16 L58 8 L62 20 L64 12 L68 28"
        stroke="#22D3EE"
        strokeWidth="2"
        strokeLinecap="round"
        fill="#155E75"
        opacity="0.8"
      />

      {/* Bioluminescent Angler Antenna Lure */}
      <g>
        {/* Curved Antenna Stalk */}
        <path
          d="M48 24 C44 14 36 10 32 14 C30 16 32 20 34 20"
          stroke="#06B6D4"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Pulsing Lure Bulb */}
        <g className={animated ? "animate-alien-angler" : ""}>
          <circle cx="34" cy="20" r="4.5" fill="#00F0FF" filter="url(#angler-lure-glow)" />
          <circle cx="34" cy="20" r="2" fill="#FFFFFF" />
        </g>
      </g>

      {/* Fish/Shark Torso & Neck */}
      <path
        d="M32 54 C30 68 34 82 50 88 C66 82 70 68 68 54 C66 46 62 42 50 42 C38 42 34 46 32 54 Z"
        fill="url(#ripjaws-skin)"
        stroke="#083344"
        strokeWidth="1.5"
      />

      {/* Pale Scaled Underbelly */}
      <path
        d="M40 54 C38 66 42 78 50 84 C58 78 62 66 60 54 C58 48 54 46 50 46 C46 46 42 48 40 54 Z"
        fill="url(#ripjaws-underbelly)"
        opacity="0.9"
      />

      {/* Lateral Gill Slits */}
      <path d="M36 60 Q38 64 36 68 M32 62 Q34 66 32 70" stroke="#083344" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M64 60 Q62 64 64 68 M68 62 Q66 66 68 70" stroke="#083344" strokeWidth="1.5" strokeLinecap="round" />

      {/* Predatory Head & Cranium */}
      <path
        d="M36 30 C36 22 42 18 50 18 C58 18 64 22 64 30 L66 42 C64 46 60 50 50 50 C40 50 36 46 34 42 Z"
        fill="url(#ripjaws-skin)"
        stroke="#083344"
        strokeWidth="1.5"
      />

      {/* Gaping Predatory Piranha Jaws */}
      <path
        d="M36 38 C42 42 58 42 64 38 L62 48 C56 54 44 54 38 48 Z"
        fill="#042F2E"
        stroke="#083344"
        strokeWidth="1.2"
      />

      {/* Upper Razor Teeth */}
      <path
        d="M38 39 L40 43 L42 39 L44 44 L46 40 L48 44 L50 40 L52 44 L54 40 L56 44 L58 40 L60 43 L62 39"
        fill="#FFFFFF"
        stroke="#CFFAFE"
        strokeWidth="0.6"
      />

      {/* Lower Razor Teeth */}
      <path
        d="M40 48 L42 44 L44 48 L46 43 L48 47 L50 43 L52 47 L54 43 L56 48 L58 44 L60 48"
        fill="#FFFFFF"
        stroke="#CFFAFE"
        strokeWidth="0.6"
      />

      {/* Black Omnitrix Collar Straps */}
      <path d="M38 78 L50 82 L62 78 L60 84 L50 88 L40 84 Z" fill="#0A0A0A" />

      {/* Cold Black/Cyan Aquatic Eyes */}
      <ellipse cx="42" cy="30" rx="3" ry="2.2" fill="#083344" stroke="#22D3EE" strokeWidth="1" />
      <circle cx="42" cy="30" r="1.2" fill="#00F0FF" />
      <ellipse cx="58" cy="30" rx="3" ry="2.2" fill="#083344" stroke="#22D3EE" strokeWidth="1" />
      <circle cx="58" cy="30" r="1.2" fill="#00F0FF" />

      {/* Omnitrix Chest Emblem */}
      <circle cx="50" cy="74" r="3.5" fill="#0A0A0A" stroke="#3DDC10" strokeWidth="1" />
      <circle cx="50" cy="74" r="1.6" fill="#3DDC10" />
    </svg>
  );
});

AlienRipjaws.displayName = "AlienRipjaws";
