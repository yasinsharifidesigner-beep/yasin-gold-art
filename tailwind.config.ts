import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { gold: '#B29261', 'gold-light': '#C4A676', midnight: '#16253c', surface: '#1c2e4a', platinum: '#D1D1D1' },
      fontFamily: { sans: ['Vazirmatn', 'Dana', 'Tahoma', 'sans-serif'] },
      boxShadow: { gold: '0 20px 55px rgba(178,146,97,.18)' }
    }
  },
  plugins: []
};
export default config;
