/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plum: '#5E2C4A',
        terracotta: '#B45F4A',
        marigold: '#E8A84C',
        cream: '#FDF8F2',
        ink: '#2C2C2C',
        'muted-foreground': '#8A7F7A',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'serif'],
        sans: ['"Work Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}