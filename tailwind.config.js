module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: {
        'project-background': "url('/assets/checkeredbg.jpeg')",
      }
    },
  },
  variants: {
    extend: {
      cursor: ['disabled'],
    },
  },
  plugins: ['tailwindcss'],
}
