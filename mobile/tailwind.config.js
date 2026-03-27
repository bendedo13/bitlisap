/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B4F72',
          light: '#2E86C1',
        },
        secondary: {
          DEFAULT: '#784212',
          light: '#A04000',
        },
        accent: {
          DEFAULT: '#1E8449',
          light: '#27AE60',
        },
        warning: '#E67E22',
        danger: '#C0392B',
        surface: '#FFFFFF',
        background: '#F8F9FA',
      },
    },
  },
  plugins: [],
};
