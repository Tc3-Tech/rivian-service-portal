/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rivian: {
          blue: {
            900: '#1a2d47',
            800: '#234069', 
            700: '#2b5187',
            600: '#3466aa',
          },
          gray: {
            800: '#2d2d2d',
            700: '#3d3d3d',
            600: '#4d4d4d',
            100: '#f5f5f5',
          }
        }
      }
    },
  },
  plugins: [],
}