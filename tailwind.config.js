/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx,html}"
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "0.3rem",
        "2xl": "0.5rem",
      },
      fontFamily: {
        sans: ["LamaSans", "ui-sans-serif", "system-ui", "sans-serif"],
        lama: ["LamaSans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontWeight: {
        bold: "800",
        medium: "600",
      },
      colors: {
        // Neutral Colors
        neutral: {
          50: "#f4f5f6",
          100: "#f3f4f6", 
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#595b5d",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
        // Primary Colors (Green)
        primary: {
          main: "#2e9066",
          surface: "#f2f6f4",
          focus: "#e4ede9",
          border: "#d7e4de",
          hover: "#1d7650",
          pressed: "#103525",
          DEFAULT: "#2e9066",
          foreground: "#ffffff",
        },
        // Secondary Colors (Orange)
        secondary: {
          main: "#ff9d18",
          surface: "#fff5e8",
          focus: "#ffebd1",
          border: "#ffd8a3",
          hover: "#e58400",
          pressed: "#aa6910",
          DEFAULT: "#ff9d18",
          foreground: "#ffffff",
        },
        // Legacy support
        sec: "#2e9066",
        hover: "#1d7650",
        iconsbg: "#f2f6f4",
        dark: "#111827",
        white: "white",
        background: "#f4f5f6",
        pageBg: "#f4f5f6",
        foreground: "#111827",
        error: "#ef4444",
        success: "#10b981",
        // Shadcn/ui color system
        border: "#e5e7eb",
        input: "#e5e7eb",
        ring: "#2e9066",
        muted: {
          DEFAULT: "#f3f4f6",
          foreground: "#6b7280",
        },
        accent: {
          DEFAULT: "#f3f4f6",
          foreground: "#111827",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#111827",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#111827",
        },
      },
    },
  },
  plugins: [require("tailwindcss-rtl")],
}
