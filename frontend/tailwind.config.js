/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5b8fb',
          400: '#8193f8',
          500: '#6470f3',
          600: '#4f4fe8',
          700: '#423dce',
          800: '#3733a6',
          900: '#312f83',
        },
        surface: {
          0:  '#ffffff',
          1:  '#f8f9fc',
          2:  '#f0f2f8',
          3:  '#e8ebf4',
          4:  '#dde1ef',
        },
        ink: {
          primary:   '#0f1117',
          secondary: '#3d4155',
          tertiary:  '#737891',
          ghost:     '#a8adc0',
        }
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.7 } },
      },
    },
  },
  plugins: [],
}
