import type { Config } from 'tailwindcss';

// Configuration Tailwind : palette synchronisee avec celle du GDD section 9.3.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Verts (herbes)
        grass: {
          highlight: '#a8e66c',
          light: '#8fde5d',
          base: '#63c74d',
          medium: '#3e8948',
          shadow: '#265c42',
          deep: '#193c3e',
          outline: '#1a3d24',
        },
        // Robots metalliques
        robot: {
          highlight: '#ffffff',
          chrome: '#d6d6d6',
          silver: '#c0cbdc',
          medium: '#8b9bb4',
          shadow: '#5a6988',
          deep: '#3a4466',
        },
        // Sol / terre
        soil: {
          light: '#e4a672',
          medium: '#b86f50',
          dark: '#a06d42',
          shadow: '#733e39',
          deep: '#3e2731',
        },
        // UI fonds & ciel
        sky: {
          cyan: '#2ce8f5',
          blue: '#0099db',
          deep: '#124e89',
        },
        panel: {
          base: '#fef6e0',
          shadow: '#e8d8a8',
          paper: '#ead4aa',
        },
        // Texte UI
        ink: {
          base: '#181425',
          dark: '#262b44',
        },
        // Accents
        accent: {
          gold: '#fee761',
          danger: '#ff0044',
          success: '#63c74d',
          premium: '#b55088',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'currency-pop': 'currency-pop 250ms ease-out',
      },
      keyframes: {
        'currency-pop': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
