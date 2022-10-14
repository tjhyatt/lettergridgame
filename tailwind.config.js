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
        'bronze': '#ad8a56',
        'silver': '#d7d7d7',
        'gold': '#ffd700',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
