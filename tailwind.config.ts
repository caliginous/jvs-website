import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    "bg-primary-50", "bg-primary-100", "bg-primary-500", "bg-primary-600",
    "text-primary-600", "ring-primary-600",
    "border-primary-200", "border-primary-300",
    "bg-success-600", "bg-error-600"
  ],
  theme: {
    extend: {
      colors: {
        // JVS Brand Colors
        primary: {
          50: "#f1f7f4",
          100: "#e3efe9",
          200: "#c1dfd1",
          300: "#9ecfb9",
          400: "#5fb18c",
          500: "#2f9468",
          600: "#1e7d4d",    // JVS green (primary)
          700: "#17633e",
          800: "#104a2f",
          900: "#0a3321",
        },
        accent: {
          500: "#f5b800"     // JVS gold
        },
        neutral: {
          25: "#fcfcfc",
          50: "#f7f7f7",
          100: "#f4f4f4",
          200: "#e7e7e7",
          300: "#d9d9d9",
          600: "#666666",
          800: "#222222"
        },
        success: { 600: "#15803d" },
        error: { 600: "#c62828", 50: "#fdecea" },
        warning: { 500: "#f59e0b", 50: "#fff3cd" }
      },
      fontFamily: {
        // Align with www.jvs.org.uk
        display: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        body: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px"
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.08)",
        focus: "0 0 0 3px rgba(30,125,77,0.28)" // primary-600 w/ opacity
      },
      spacing: {
        "4.5": "18px" // sometimes useful for precise vertical rhythm
      },
      maxWidth: {
        "content": "640px"
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#263238', // Charcoal for main text
            a: {
              color: '#4FC3F7', // Sky Blue for links
              '&:hover': {
                color: '#558B2F', // Deep Green for link hover
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}

export default config 