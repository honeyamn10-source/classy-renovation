import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fff8e1',
          100: '#feefb8',
          200: '#fce184',
          300: '#f8c94d',
          400: '#efb424',
          500: '#d79a12',
          600: '#b77c0e',
          700: '#915f0d',
          800: '#744d11',
          900: '#613f11'
        },
        ink: {
          50: '#f7f7f5',
          100: '#ecebe5',
          200: '#d5d2c8',
          300: '#b0ab9c',
          400: '#8d8676',
          500: '#6b6455',
          600: '#514b3d',
          700: '#38322a',
          800: '#24211b',
          900: '#12100d'
        }
      },
      boxShadow: {
        luxe: '0 24px 80px -24px rgba(215,154,18,0.25)'
      },
      backgroundImage: {
        'radial-luxe': 'radial-gradient(circle at top left, rgba(215,154,18,0.18), transparent 45%), radial-gradient(circle at bottom right, rgba(255,255,255,0.08), transparent 40%)'
      }
    }
  },
  plugins: []
};

export default config;
