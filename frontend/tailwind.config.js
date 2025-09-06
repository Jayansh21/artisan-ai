// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6', 
          600: '#2563eb',
          700: '#1d4ed8',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out'
      }
    },
  },
  plugins: [],
  safelist: [
    'bg-red-50', 'bg-blue-50', 'bg-green-50', 'bg-purple-50', 'bg-yellow-50', 'bg-orange-50',
    'border-red-200', 'border-blue-200', 'border-green-200', 'border-purple-200', 'border-yellow-200', 'border-orange-200',
    'text-red-800', 'text-blue-800', 'text-green-800', 'text-purple-800', 'text-yellow-800', 'text-orange-800',
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-orange-500'
  ]
}