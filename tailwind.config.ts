import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * Tailwind v4 design system for the Food Manager app.
 * Wired into v4 via `@config "../tailwind.config.ts"` in `app/globals.css`.
 *
 * Color tokens still live in `@theme inline` in `globals.css` so that
 * shadcn/ui CSS variables (light + dark) remain the single source of truth.
 * Everything else (type scale, elevation, radius, motion, z-index) is here
 * so it is statically typed and easy to audit.
 *
 * See `.cursor/rules/ui-ux-pro-max.mdc` and
 * `.agents/skills/ui-ux-pro-max/SKILL.md` for design rationale.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
        "2xl": "3rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },

      // Modular type scale (12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60 / 72)
      // Each size ships with a sensible line-height and letter-spacing.
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.01em" }],
        sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0" }],
        base: ["1rem", { lineHeight: "1.5rem", letterSpacing: "0" }],
        lg: ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "-0.005em" }],
        xl: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em" }],
        "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.015em" }],
        "3xl": [
          "1.875rem",
          { lineHeight: "2.25rem", letterSpacing: "-0.02em" },
        ],
        "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.025em" }],
        "5xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        "6xl": ["3.75rem", { lineHeight: "1.05", letterSpacing: "-0.035em" }],
        "7xl": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.04em" }],
        "8xl": ["6rem", { lineHeight: "1", letterSpacing: "-0.045em" }],
      },

      borderRadius: {
        none: "0",
        xs: "calc(var(--radius) - 6px)",
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",
        full: "9999px",
      },

      // Elevation scale — keep shadow choices on this rail.
      // Used for: card (sm/md), popover (lg), modal (xl), spotlight (2xl).
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05), 0 1px 3px 0 rgb(0 0 0 / 0.06)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.10), 0 4px 6px -4px rgb(0 0 0 / 0.08)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.12), 0 8px 10px -6px rgb(0 0 0 / 0.08)",
        "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
        glow: "0 0 0 1px rgb(var(--ring-rgb, 59 130 246) / 0.30), 0 0 24px 0 rgb(var(--ring-rgb, 59 130 246) / 0.25)",
        "glow-sm":
          "0 0 0 1px rgb(var(--ring-rgb, 59 130 246) / 0.20), 0 0 12px 0 rgb(var(--ring-rgb, 59 130 246) / 0.15)",
        none: "none",
      },

      // Semantic z-index scale — never use z-[9999].
      zIndex: {
        base: "0",
        raised: "10",
        dropdown: "1000",
        sticky: "1020",
        overlay: "1030",
        modal: "1040",
        popover: "1050",
        toast: "1060",
        tooltip: "1070",
      },

      // Motion tokens — UI/UX Pro Max recommends 150–300ms for micro,
      // ≤400ms for complex transitions. Avoid >500ms for state changes.
      transitionDuration: {
        instant: "75ms",
        fast: "150ms",
        base: "200ms",
        slow: "300ms",
        slower: "500ms",
        slowest: "700ms",
      },

      transitionTimingFunction: {
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-quart": "cubic-bezier(0.76, 0, 0.24, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },

      // Reusable keyframes (mirrored in globals.css for SSR-safety).
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(40px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          from: { opacity: "0", transform: "translateY(-40px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-left": {
          from: { opacity: "0", transform: "translateX(-40px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-right": {
          from: { opacity: "0", transform: "translateX(40px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.92)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "blur-in": {
          from: { opacity: "0", filter: "blur(10px)" },
          to: { opacity: "1", filter: "blur(0)" },
        },
        "slide-reveal": {
          from: { opacity: "0", clipPath: "inset(0 100% 0 0)" },
          to: { opacity: "1", clipPath: "inset(0 0 0 0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "line-expand": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow:
              "0 0 5px rgb(59 130 246 / 0.5), 0 0 10px rgb(59 130 246 / 0.3)",
          },
          "50%": {
            boxShadow:
              "0 0 20px rgb(59 130 246 / 0.8), 0 0 30px rgb(59 130 246 / 0.5)",
          },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },

      animation: {
        "fade-in": "fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-up": "fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-down":
          "fade-in-down 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-left":
          "fade-in-left 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-right":
          "fade-in-right 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scale-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "blur-in": "blur-in 0.5s ease-out forwards",
        "slide-reveal": "slide-reveal 1s cubic-bezier(0.76, 0, 0.24, 1) forwards",
        float: "float 3s ease-in-out infinite",
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
        "line-expand": "line-expand 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        shimmer: "shimmer 3s ease-in-out infinite",
        "gradient-shift": "gradient-shift 3s ease infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        ripple: "ripple 0.6s ease-out",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },

      backgroundImage: {
        "gradient-radial":
          "radial-gradient(var(--tw-gradient-stops, circle at center))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      backdropBlur: {
        xs: "2px",
      },

      // Constrain prose width to UI/UX Pro Max line-length recommendation
      // (35–60 chars mobile, 60–75 desktop).
      maxWidth: {
        prose: "65ch",
        "prose-sm": "45ch",
        "prose-lg": "75ch",
      },
    },
  },
  plugins: [animate],
};

export default config;
