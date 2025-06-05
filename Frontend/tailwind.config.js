/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-blue-500',
    'bg-purple-500',
    'bg-green-500',
    'text-blue-400',
    'text-purple-400',
    'text-green-400',
    'border-blue-500/50',
    'border-purple-500/50',
    'border-green-500/50',
    'bg-blue-500/20',
    'bg-purple-500/20',
    'bg-green-500/20',
    'text-blue-500',
    'text-purple-500',
    'text-green-500',
    'border-blue-500/20',
    'border-purple-500/20',
    'border-green-500/20',
  ],
};