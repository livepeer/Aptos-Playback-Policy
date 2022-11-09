/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{html,js,tsx}', './components/**/*.{html,js,tsx}'],
  theme: {
    extend: {
      colors: {
        'aptos-green': '#48E1AF',
      },
    },
  },
  plugins: [],
};
