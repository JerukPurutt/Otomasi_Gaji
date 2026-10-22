/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#fdf2f4',
          100: '#fbe6ea',
          200: '#f7cfd8',
          300: '#efabb9',
          400: '#e3778e',
          500: '#d04968',
          600: '#b72d4e',
          700: '#800020', // classic rich burgundy
          800: '#6d0720',
          900: '#4e0a1b',
          950: '#2c040e',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'burgundy-glow': '0 0 25px -5px rgba(128, 0, 32, 0.25)',
        'burgundy-glow-lg': '0 0 35px -5px rgba(128, 0, 32, 0.4)',
      }
    },
  },
  plugins: [],
}
