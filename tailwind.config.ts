import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Sith design tokens
        void: {
          950: "#05050a",
          900: "#0a0a0f",
          800: "#11111a",
          700: "#1a1a26",
          600: "#23232f",
        },
        ash: {
          500: "#3a3a42",
          400: "#52525b",
          300: "#71717a",
          200: "#a1a1aa",
          100: "#d4d4d8",
        },
        blood: {
          900: "#3a050c",
          800: "#5c0810",
          700: "#7a0a14",
          600: "#9a0f1c",
          500: "#c41e3a",
          400: "#e53e5b",
        },
        gilt: {
          700: "#7a6332",
          600: "#9a7f44",
          500: "#c9a961",
          400: "#e0c585",
        },
        force: {
          700: "#3a0f6b",
          600: "#5a1a8a",
          500: "#7c3aed",
        },
      },
      fontFamily: {
        display: ["var(--font-cinzel)", "Cinzel", "serif"],
        body: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        "sith-glow": "0 0 24px rgba(196, 30, 58, 0.35)",
        "force-glow": "0 0 24px rgba(124, 58, 237, 0.35)",
        "panel": "inset 0 0 0 1px rgba(201, 169, 97, 0.15), 0 8px 32px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "panel-grad":
          "linear-gradient(180deg, rgba(17,17,26,0.95) 0%, rgba(10,10,15,0.95) 100%)",
        "blood-grad":
          "linear-gradient(135deg, #7a0a14 0%, #c41e3a 50%, #5c0810 100%)",
      },
      keyframes: {
        flicker: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        ember: {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0.8" },
          "100%": { transform: "translateY(-40px) scale(0.4)", opacity: "0" },
        },
      },
      animation: {
        flicker: "flicker 3s ease-in-out infinite",
        ember: "ember 2.5s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
