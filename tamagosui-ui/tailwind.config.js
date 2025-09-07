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
        'rotate-in': {
          '0%': { transform: 'rotate(-180deg) scale(0.5)', opacity: '0' },
          '100%': { transform: 'rotate(0deg) scale(1)', opacity: '1' },
        },
        'rotate-out': {
          '0%': { transform: 'rotate(0deg) scale(1)', opacity: '1' },
          '100%': { transform: 'rotate(180deg) scale(0.5)', opacity: '0' },
        },
        // === TAMBAHKAN KEYFRAME BARU INI ===
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
        'rotate-in': 'rotate-in 0.3s ease-out forwards',
        'rotate-out': 'rotate-out 0.3s ease-out forwards',
        'aura-glow': 'aura-glow 2.5s ease-in-out infinite',
        'dream-fade': 'dream-fade 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}