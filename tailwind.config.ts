import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050D18',
          900: '#0A1929',
          800: '#0F2340',
          700: '#142D52',
        },
        charcoal: {
          900: '#111827',
          800: '#1E293B',
          700: '#263548',
          600: '#334155',
        },
        electric: {
          500: '#3B82F6',
          400: '#60A5FA',
          300: '#93C5FD',
          600: '#2563EB',
        },
        amber: {
          500: '#F59E0B',
          400: '#FBBF24',
          600: '#D97706',
        },
        tactical: {
          green: '#10B981',
          red: '#EF4444',
          purple: '#8B5CF6',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        serif: ['Crimson Pro', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'waveform': 'waveform 1.2s ease-in-out infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        waveform: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(59 130 246 / 0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e\")",
        'hex-pattern': "url(\"data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%233B82F6' fill-opacity='0.03'%3e%3cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e\")",
      },
      boxShadow: {
        'electric': '0 0 20px rgba(59, 130, 246, 0.3)',
        'electric-lg': '0 0 40px rgba(59, 130, 246, 0.4)',
        'amber': '0 0 20px rgba(245, 158, 11, 0.3)',
        'inner-electric': 'inset 0 0 20px rgba(59, 130, 246, 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
