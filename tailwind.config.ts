import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Paleta pastel para niños
        pastel: {
          blue: '#A8D8EA',
          pink: '#FFB6D9',
          yellow: '#FFF5BA',
          green: '#B5EAD7',
          purple: '#C7CEEA',
          orange: '#FFDAB9',
          sky: '#C5E3F6',
          mint: '#D4F4DD',
          peach: '#FFD3B6',
          lavender: '#E8D5F2',
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        }
      }
    }
  }
} satisfies Config