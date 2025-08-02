import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Palette
        primary: {
          50: '#f0f9f4',
          100: '#dcf2e3',
          200: '#b8e4c7',
          300: '#8dd4a8',
          400: '#8BC34A', // Primary Green
          500: '#558B2F', // Deep Green (Alt)
          600: '#2E7D32', // Dark Forest
          700: '#1a3f15',
          800: '#153312',
          900: '#0f2a0e',
        },
        // Accent Colors
        accent: {
          coral: '#FF6F61', // Warm Coral (Millennial Pink)
          sky: '#4FC3F7', // Sky Blue
          lavender: '#CE93D8', // Soft Lavender
          golden: '#FFCA28', // Golden Sand
        },
        // Neutrals
        neutral: {
          50: '#FAFAFA', // Off-White
          100: '#F5F5F0', // Stone Beige
          200: '#B0BEC5', // Warm Grey
          300: '#90A4AE',
          400: '#78909C',
          500: '#607D8B',
          600: '#546E7A',
          700: '#455A64',
          800: '#37474F',
          900: '#263238', // Charcoal
        },
        // Legacy support - map old colors to new ones
        secondary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#FFCA28', // Golden Sand
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
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
  ],
}

export default config 