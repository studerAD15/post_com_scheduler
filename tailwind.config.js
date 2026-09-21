/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        omni: {
          green: "#3DDC10",       // Omnitrix hazard green
          "green-hover": "#34C20C",
          "green-muted": "rgba(61, 220, 16, 0.15)",
          black: "#0A0A0A",       // Deep pure black background
          surface: "#141414",     // Dark surface panel
          panel: "#1C1C1C",       // Dark tile panel
          white: "#FFFFFF",       // Pure high-contrast white
          offwhite: "#F8F9FA",    // Soft white card surface
          border: "#2A2A2A",      // Dark border
          "border-light": "#E2E8F0", // White card border
          orange: "#FF7A00",      // Omnitrix warning orange
          gray: "#71717A",        // Subdued meta gray
          darkgray: "#27272A",
        },
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        space: ["Space Grotesk", "sans-serif"],
        rajdhani: ["Rajdhani", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        tempting: ["Tempting", "cursive"],
        switzer: ["Switzer", "sans-serif"],
        sekuya: ["Sekuya", "serif"],
      },
      borderRadius: {
        DEFAULT: "4px",
        sm: "3px",
        md: "4px",
        lg: "6px",
        xl: "8px",
      },
      boxShadow: {
        omni: "0 0 15px rgba(61, 220, 16, 0.25)",
        "omni-lg": "0 0 30px rgba(61, 220, 16, 0.35)",
        "omni-warning": "0 0 20px rgba(255, 122, 0, 0.3)",
        "card-white": "0 4px 20px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(61, 220, 16, 0.15)",
      },
    },
  },
  plugins: [],
};
