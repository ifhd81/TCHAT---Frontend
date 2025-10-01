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
        // النظام الجديد - Indigo Based
        primary: {
          DEFAULT: "#4f46e5", // Indigo-600
          foreground: "#ffffff",
          hover: "#4338ca", // Indigo-700
          50: "#eef2ff",
          500: "#6366f1", // Indigo-500
          600: "#4f46e5", // Indigo-600
          700: "#4338ca", // Indigo-700
        },
        background: "#ffffff", // أبيض
        foreground: "#1f2937", // Gray-800
        card: {
          DEFAULT: "#ffffff",
          foreground: "#1f2937",
        },
        popover: {
          DEFAULT: "#ffffff", 
          foreground: "#1f2937",
        },
        secondary: {
          DEFAULT: "#f9fafb", // Gray-50
          foreground: "#1f2937",
        },
        muted: {
          DEFAULT: "#f3f4f6", // Gray-100
          foreground: "#6b7280", // Gray-500
        },
        accent: {
          DEFAULT: "#f3f4f6",
          foreground: "#1f2937",
        },
        border: "#e5e7eb", // Gray-200
        input: "#e5e7eb", // Gray-200  
        ring: "#6366f1", // Indigo-500
        // ألوان الحالة
        success: "#10b981", // Emerald-500
        warning: "#f59e0b", // Amber-500
        destructive: {
          DEFAULT: "#ef4444", // Red-500
          foreground: "#ffffff",
        },
        error: "#ef4444",
        // ألوان الرسوم البيانية
        chart: {
          1: "#10b981", // أخضر
          2: "#3b82f6", // أزرق  
          3: "#8b5cf6", // بنفسجي
          4: "#f59e0b", // برتقالي
          5: "#ef4444", // أحمر
        },
        // Sidebar colors
        sidebar: {
          DEFAULT: "rgba(255, 255, 255, 0.95)",
          foreground: "#1f2937",
          primary: "#4f46e5",
          "primary-foreground": "#ffffff",
          accent: "#eef2ff", // Indigo-50
          "accent-foreground": "#4f46e5",
          border: "rgba(79, 70, 229, 0.1)",
          ring: "#6366f1",
        },
      },
    },
  },
  plugins: [],
}
