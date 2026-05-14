import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brief: {
          bg: '#0f0f0f',
          surface: '#1a1a1a',
          surface2: '#242424',
          border: '#2e2e2e',
          text: '#f0f0f0',
          muted: '#888888',
          accent: '#f59e0b',
          'accent-dim': '#d97706',
          urgent: '#ef4444',
          warm: '#f59e0b',
          hot: '#ef4444',
          cold: '#94a3b8',
          new: '#10b981',
        },
      },
      fontFamily: {
        serif: ['Crimson Pro', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
export default config;
