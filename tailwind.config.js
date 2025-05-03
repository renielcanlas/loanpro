/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0f9',
          100: '#cce0f3',
          200: '#99c2e6',
          300: '#66a3da',
          400: '#3385cd',
          500: '#0A6EBD',
          600: '#085897',
          700: '#064271',
          800: '#042c4b',
          900: '#021625',
        },
        accent: {
          50: '#eafbef',
          100: '#d5f7de',
          200: '#abeebe',
          300: '#82e69d',
          400: '#58dd7d',
          500: '#3CCF4E',
          600: '#30a63e',
          700: '#247c2f',
          800: '#18531f',
          900: '#0c2910',
        },
        warning: {
          50: '#ffefef',
          100: '#ffdede',
          200: '#ffbdbd',
          300: '#ff9c9c',
          400: '#ff7b7b',
          500: '#FF5D5D',
          600: '#cc4a4a',
          700: '#993838',
          800: '#662525',
          900: '#331313',
        },
        neutral: {
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
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', '1.125rem'],
        sm: ['0.875rem', '1.25rem'],
        base: ['1rem', '1.5rem'],
        lg: ['1.125rem', '1.75rem'],
        xl: ['1.25rem', '1.875rem'],
        '2xl': ['1.5rem', '2rem'],
        '3xl': ['1.875rem', '2.25rem'],
        '4xl': ['2.25rem', '2.5rem'],
        '5xl': ['3rem', '1'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}