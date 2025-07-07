/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Paleta oficial OnService
        'onservice': {
          // Acentos principales
          'violet': '#7C3AED',
          'cyan': '#38BDF8',
          
          // Fondos
          'bg-light': '#FFFFFF',
          'bg-dark': '#111827',
          
          // Textos
          'text-light': '#1F2937',
          'text-dark': '#F9FAFB',
          
          // Dividers
          'divider-light': '#E5E7EB',
          'divider-dark': '#4B5563',
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
} 