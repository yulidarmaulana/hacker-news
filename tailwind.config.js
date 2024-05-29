/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        'mystic-100': '#f7f7f7',
        'mystic-200': '#f3f4f6',
        'mystic-300': '#e5e7eb',
        'mystic-400': '#9ca3af',
        'mystic-500': '#6b7280',
        'mystic-600': '#4b5563',
        'mystic-700': '#374151',
        'mystic-800': '#1f2937',
        'mystic-900': '#111827',
      }
    },
  },
  plugins: [],
}

