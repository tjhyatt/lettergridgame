module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'bonus-green': '#10be4a',
        'bonus-blue': '#1178ff',
        'bonus-orange': '#ffac11',
        'bonus-purple': '#a011ff',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
