/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"EB Garamond"', 'serif'],
        sans: ['Lato', 'sans-serif'],
      },
      colors: {
        'zembil-blue': '#367588',
        'zembil-beige': '#FDF6E3',
        'zembil-grey': '#F2F2F2',
        'zembil-terracotta': '#C07C4A',
      },
    },
  },
  plugins: [],
};
