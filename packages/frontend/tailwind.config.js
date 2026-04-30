/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand red accent
        red: {
          DEFAULT: '#ef233c',
          glow: 'rgba(239,35,60,0.5)',
          dim: 'rgba(239,35,60,0.15)',
        },
        // Dark backgrounds
        bg: {
          base: '#000000',
          surface: '#0a0a0a',
          elevated: '#111111',
          card: 'rgba(255,255,255,0.03)',
        },
        // Borders
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          subtle: 'rgba(255,255,255,0.05)',
          strong: 'rgba(255,255,255,0.15)',
        },
        // Text
        text: {
          primary: '#ffffff',
          secondary: 'rgba(255,255,255,0.6)',
          muted: 'rgba(255,255,255,0.35)',
          red: '#ef233c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        'red-glow': '0 0 20px rgba(239,35,60,0.4), 0 0 40px rgba(239,35,60,0.1)',
        'red-glow-sm': '0 0 10px rgba(239,35,60,0.3)',
        glass: '0 8px 32px rgba(0,0,0,0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'pulse-red': 'pulseRed 2s ease-in-out infinite',
        'border-spin': 'borderSpin 3s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(239,35,60,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(239,35,60,0.6)' },
        },
        borderSpin: {
          from: { '--gradient-angle': '0deg' },
          to: { '--gradient-angle': '360deg' },
        },
      },
    },
  },
  plugins: [],
};
