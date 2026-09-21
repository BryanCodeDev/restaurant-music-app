/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Dynamic classes used at runtime
    'bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
    'text-red-500', 'text-green-500', 'text-blue-500', 'text-yellow-500', 'text-purple-500', 'text-pink-500', 'text-indigo-500', 'text-orange-500',
    'border-red-500', 'border-green-500', 'border-blue-500', 'border-yellow-500', 'border-purple-500', 'border-pink-500', 'border-indigo-500', 'border-orange-500',
    // Animation classes
    'animate-spin', 'animate-pulse', 'animate-bounce', 'animate-fade-in-up', 'animate-scale-in',
    // Grid/flex classes
    'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'grid-cols-5', 'grid-cols-6',
    'lg:grid-cols-2', 'lg:grid-cols-3', 'lg:grid-cols-4',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}