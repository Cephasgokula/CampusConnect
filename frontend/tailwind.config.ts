import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#f7f9fb',
          'container-low': '#f2f4f6',
          'container': '#ebedf0',
          'container-high': '#dfe1e5',
          'container-lowest': '#ffffff',
          bright: '#f7f9fb',
        },
        primary: {
          DEFAULT: '#00355f',
          container: '#0f4c81',
          fixed: '#d1e4ff',
        },
        secondary: {
          DEFAULT: '#0051d5',
          container: '#316bf3',
          fixed: '#dbe1ff',
          'fixed-dim': '#b4c5ff',
        },
        'on-surface': {
          DEFAULT: '#191c1e',
          variant: '#42474f',
        },
        'outline-variant': '#c2c7d1',
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
        success: '#16a34a',
      },
      borderRadius: {
        sm: '4px',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1', fontWeight: '800' }],
        'headline-lg': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        'headline-md': ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],
        'body-md': ['0.875rem', { lineHeight: '1.5' }],
        'label-sm': ['0.6875rem', { lineHeight: '1', fontWeight: '600', letterSpacing: '0.05em' }],
      },
      boxShadow: {
        ambient: '0 4px 24px rgba(0, 53, 95, 0.04)',
        'ambient-lg': '0 8px 32px rgba(0, 53, 95, 0.06)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
