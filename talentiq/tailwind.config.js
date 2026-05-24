/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        "star-movement-top": {
          "0%": {
            transform: "translateX(-30%)",
          },
          "100%": {
            transform: "translateX(30%)",
          },
        },

        "star-movement-bottom": {
          "0%": {
            transform: "translateX(30%)",
          },
          "100%": {
            transform: "translateX(-30%)",
          },
        },

        "star-movement-left": {
          "0%": {
            transform: "translateY(-30%)",
          },
          "100%": {
            transform: "translateY(30%)",
          },
        },

        "star-movement-right": {
          "0%": {
            transform: "translateY(30%)",
          },
          "100%": {
            transform: "translateY(-30%)",
          },
        },
      },

      animation: {
        "star-movement-top":
          "star-movement-top linear infinite alternate",

        "star-movement-bottom":
          "star-movement-bottom linear infinite alternate",

        "star-movement-left":
          "star-movement-left linear infinite alternate",

        "star-movement-right":
          "star-movement-right linear infinite alternate",
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
