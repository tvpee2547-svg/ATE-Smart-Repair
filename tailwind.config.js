/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf2f2',
          100: '#fbe4e4',
          200: '#f8caca',
          300: '#f2a1a1',
          400: '#e86b6b',
          500: '#d94141',
          600: '#c52828', // Red
          700: '#a51d1d',
          800: '#891c1c', // Maroon / ขาวเลือดหมู
          900: '#721c1c', // Deep Maroon
          950: '#3e0a0a',
        },
        surface: '#ffffff',
        primary: '#891c1c',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Thai', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(137, 28, 28, 0.05)',
        'card': '0 4px 20px rgba(137, 28, 28, 0.08)',
        'elevated': '0 10px 40px rgba(137, 28, 28, 0.12)',
      },
    },
  },
  plugins: [],
}
