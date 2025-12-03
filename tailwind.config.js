/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4a9eff',
        'primary-glow': '#4a9eff',
        dark: {
          bg: '#0a0a0f',
          surface: '#151520',
          border: '#2a2a3a',
          text: '#e0e0e0',
          'text-muted': '#a0a0b0',
        }
      },
      spacing: {
        '15': '3.75rem',
        '70': '17.5rem',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        glow: {
          '0%': { 'box-shadow': '0 0 5px rgba(74, 158, 255, 0.5), 0 0 10px rgba(74, 158, 255, 0.3)' },
          '100%': { 'box-shadow': '0 0 20px rgba(74, 158, 255, 0.8), 0 0 30px rgba(74, 158, 255, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

