/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        reborn: {
          navy: '#0B132B',
          darkest: '#060B18',
          card: '#0E1834',
          border: '#1E2D58',
          maroon: '#800000',
          terracotta: '#A33B26',
          gold: '#A4773A',
          goldLight: '#D4AF37',
          offwhite: '#F7F4EB',
          cyan: '#00E5FF',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          violet: '#8B5CF6',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px -5px rgba(0, 229, 255, 0.3)',
        'glow-gold': '0 0 20px -5px rgba(164, 119, 58, 0.4)',
        'glow-terracotta': '0 0 20px -5px rgba(163, 59, 38, 0.4)',
      },
      animation: {
        pulseSlow: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
