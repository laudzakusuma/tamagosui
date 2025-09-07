import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionDuration: {
        '400': '400ms',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-bg': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'breathing': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
        // Keyframe aura-glow dipindahkan ke sini
        'aura-glow': {
          '0%, 100%': { opacity: 0.7 },
          '50%': { opacity: 1 },
        },
        'dream-fade': {
          '0%, 100%': { opacity: 0, transform: 'scale(0.9)' },
          '20%, 80%': { opacity: 1, transform: 'scale(1)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'pulse-bg': 'pulse-bg 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'breathing': 'breathing 3s ease-in-out infinite',
        // Animasi aura-glow juga tetap di sini
        'aura-glow': 'aura-glow 2.5s ease-in-out infinite',
        'dream-fade': 'dream-fade 3s ease-in-out infinite',
      }
    },
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.aura-coin-magnet': {
          '@apply shadow-[0_0_20px_5px] shadow-yellow-400/80 animate-aura-glow': {},
        },
        '.aura-xp-boost': {
          '@apply shadow-[0_0_20px_5px] shadow-purple-400/80 animate-aura-glow': {},
        }
      })
    })
  ],
}