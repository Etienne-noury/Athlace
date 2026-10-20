import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

// Format avec <alpha-value> : permet text-nuit/70, bg-primary/90, etc.
const v = (n: string) => `hsl(var(--${n}) / <alpha-value>)`;

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Charte
        "bleu-athlace": v("bleu-athlace"),
        lime: v("lime"),
        creme: v("creme"),
        nuit: v("nuit"),
        blanc: v("blanc"),
        // shadcn/ui
        border: v("border"), input: v("input"), ring: v("ring"),
        background: v("background"), foreground: v("foreground"),
        primary: { DEFAULT: v("primary"), foreground: v("primary-foreground") },
        secondary: { DEFAULT: v("secondary"), foreground: v("secondary-foreground") },
        destructive: { DEFAULT: v("destructive"), foreground: v("destructive-foreground") },
        muted: { DEFAULT: v("muted"), foreground: v("muted-foreground") },
        accent: { DEFAULT: v("accent"), foreground: v("accent-foreground") },
        popover: { DEFAULT: v("popover"), foreground: v("popover-foreground") },
        card: { DEFAULT: v("card"), foreground: v("card-foreground") },
        glass: { DEFAULT: "var(--glass)", border: "var(--glass-border)" },
      },
      fontFamily: {
        sans: ['"Poppins"', "system-ui", "sans-serif"],
        display: ['"Poppins"', "system-ui", "sans-serif"],
      },
      fontSize: {
        // Charte : Headlines Black 900, Subheads Bold 700, Body Light 300
        "headline-xl": ["56px", { lineHeight: "60px", fontWeight: "900" }],
        headline: ["40px", { lineHeight: "44px", fontWeight: "900" }],
        "headline-sm": ["28px", { lineHeight: "34px", fontWeight: "900" }],
        subhead: ["22px", { lineHeight: "30px", fontWeight: "700" }],
        "subhead-sm": ["16px", { lineHeight: "24px", fontWeight: "700" }],
        eyebrow: ["12px", { lineHeight: "16px", fontWeight: "700", letterSpacing: "0.04em" }],
        button: ["14px", { lineHeight: "20px", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "300" }],
        body: ["15px", { lineHeight: "24px", fontWeight: "300" }],
        "body-sm": ["13px", { lineHeight: "20px", fontWeight: "300" }],
        // Alias temporaires des anciens noms
        display: ["42px", { lineHeight: "48px", fontWeight: "900" }],
        "heading-1": ["32px", { lineHeight: "40px", fontWeight: "900" }],
        "heading-2": ["28px", { lineHeight: "36px", fontWeight: "900" }],
        title: ["20px", { lineHeight: "28px", fontWeight: "700" }],
        subtitle: ["16px", { lineHeight: "24px", fontWeight: "700" }],
        "label-title": ["14px", { lineHeight: "20px", fontWeight: "700" }],
        small: ["14px", { lineHeight: "20px", fontWeight: "300" }],
        caption: ["13px", { lineHeight: "18px", fontWeight: "300" }],
        micro: ["12px", { lineHeight: "16px", fontWeight: "300" }],
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
