/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2463eb',
          light: 'rgba(36, 99, 235, 0.2)',
          lighter: 'rgba(36, 99, 235, 0.1)',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        background: {
          DEFAULT: '#f6f6f8',
          card: '#ffffff',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'Noto Sans JP', 'sans-serif'],
      },
      boxShadow: {
        'card': '0px 1px 2px 0px rgba(0,0,0,0.05)',
        'card-lg': '0px 20px 25px -5px rgba(0,0,0,0.1), 0px 8px 10px -6px rgba(0,0,0,0.1)',
        'primary': '0px 10px 15px -3px rgba(36,99,235,0.2), 0px 4px 6px -4px rgba(36,99,235,0.2)',
        'primary-sm': '0px 4px 6px -1px rgba(36,99,235,0.2), 0px 2px 4px -2px rgba(36,99,235,0.2)',
        'container': '0px 25px 50px -12px rgba(0,0,0,0.25)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '6px',
        md: '12px',
      }
    },
  },
  plugins: [],
}
