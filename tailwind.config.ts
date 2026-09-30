import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const v = (n: string) => `hsl(var(--${n}))`;

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: v("border"), input: v("input"), ring: v("ring"),
        background: v("background"), foreground: v("foreground"),
        primary: { DEFAULT: v("primary"), foreground: v("primary-foreground") },
        secondary: { DEFAULT: v("secondary"), foreground: v("secondary-foreground") },
        destructive: { DEFAULT: v("destructive"), foreground: v("destructive-foreground") },
        muted: { DEFAULT: v("muted"), foreground: v("muted-foreground") },
        accent: { DEFAULT: v("accent"), foreground: v("accent-foreground") },
        popover: { DEFAULT: v("popover"), foreground: v("popover-foreground") },
        card: { DEFAULT: v("card"), foreground: v("card-foreground") },
        blue: { 500: v("blue-500"), 700: v("blue-700") },
        lime: { 500: v("lime-500") },
        cream: { 100: v("cream-100") },
        ink: v("ink"),
        slate: { 500: v("slate-500"), 600: v("slate-600") },
        olive: { 900: v("olive-900") },
        tint: { 100: v("tint-100") },
        surface: { DEFAULT: v("surface"), alt: v("surface-alt") },
        overlay: "var(--overlay)",
        glass: { DEFAULT: "var(--glass)", border: "var(--glass-border)" },
      },
      fontFamily: {
        display: ['"Outfit"', "system-ui", "sans-serif"],
        sans: ['"Figtree"', "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["42px", { lineHeight: "48px", fontWeight: "800" }],
        "heading-1": ["32px", { lineHeight: "40px", fontWeight: "700" }],
        "heading-2": ["28px", { lineHeight: "36px", fontWeight: "700" }],
        title: ["20px", { lineHeight: "28px", fontWeight: "700" }],
        subtitle: ["16px", { lineHeight: "24px", fontWeight: "700" }],
        "label-title": ["14px", { lineHeight: "20px", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "28px" }],
        body: ["15px", { lineHeight: "24px" }],
        small: ["14px", { lineHeight: "20px" }],
        caption: ["13px", { lineHeight: "18px" }],
        micro: ["12px", { lineHeight: "16px" }],
      },
      spacing: { "s-1": "4px", "s-2": "8px", "s-3": "12px", "s-4": "16px", "s-6": "24px", "s-8": "32px", "s-12": "48px", "s-16": "64px" },
      borderRadius: {
        sm: "var(--radius-sm)", md: "var(--radius-md)", lg: "var(--radius-lg)",
        xl: "var(--radius-xl)", "2xl": "var(--radius-2xl)", "3xl": "var(--radius-3xl)", pill: "var(--radius-pill)",
      },
      backdropBlur: { glass: "12px" },
    },
  },
  plugins: [animate],
} satisfies Config;
