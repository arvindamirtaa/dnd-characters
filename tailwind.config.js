/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        'dnd-primary': '#E0A458',
        'dnd-primary-light': '#F4C67A',
        'dnd-primary-dark': '#C88D3F',
        'dnd-secondary': '#9C2B27',
        'dnd-secondary-light': '#BE332E',
        'dnd-secondary-dark': '#7A2220',
        'dnd-dark': '#1E1E1E',
        'dnd-dark-light': '#2C2C2C',
        'dnd-dark-dark': '#111111',
        'dnd-light': '#F2E8D4',
        'dnd-light-light': '#FFFCF2',
        'dnd-light-dark': '#D8CEB8',
      },
      fontFamily: {
        medieval: ['MedievalSharp', 'Fondamento', 'serif'],
      },
      boxShadow: {
        'scroll': '0 4px 10px rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        'parchment': "url('/images/parchment-bg.jpg')",
        'dungeon': "url('/images/dungeon-bg.jpg')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}