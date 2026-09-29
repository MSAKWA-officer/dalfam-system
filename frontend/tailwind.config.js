/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dalfam: {
          dark: '#12241f',
          green: '#2f4a3c',
          gold: '#c9a24b',
          cream: '#f7f5f0',
        },
      },
    },
  },
  plugins: [],
};
