/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B7FFF',
        secondary: '#A855F7',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        light: '#F3F4F6',
        dark: '#1F2937',
      },
    },
  },
  plugins: [],
}
