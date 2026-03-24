import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem'
    },
    extend: {
      colors: {
        background: '#f8fafc',
        foreground: '#0f172a',
        card: '#ffffff',
        border: '#e2e8f0',
        primary: '#0f4c81',
        secondary: '#2563eb',
        muted: '#64748b',
        danger: '#dc2626',
        success: '#16a34a'
      }
    }
  },
  plugins: []
} satisfies Config;
