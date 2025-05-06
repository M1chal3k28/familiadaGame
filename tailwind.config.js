/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        team2: colors.red[900],
        team1: colors.sky[500],
        team1light: colors.sky[100],
        team2light: colors.red[100],
      }
    },
  },
  plugins: [],
}