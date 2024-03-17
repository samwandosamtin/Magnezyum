/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
          pastelBlue: '#aec6cf',
          pastelGreen: '#77dd77',
          pastelPurple: '#b39eb5',
          pastelYellow: '#fdfd96',
          pastelRed: '#ff6961',
      },
    },
  },
  darkMode: 'class', // or 'media' or false
  plugins: [],
}