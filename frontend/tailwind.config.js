/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        background: '#FCFCFC',
        surface: '#FFFFFF',
        neutral: '#F3F4F6',
        'gray-text': '#9CA3AF',
        indigo: {
          DEFAULT: '#6366F1',
          50: '#EEF2FF',
          100: '#E0E7FF',
        },
        emerald: {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
        },
        orange: {
          DEFAULT: '#FB923C',
          50: '#FFF7ED',
        },
      },
      borderRadius: {
        card: '32px',
      },
      boxShadow: {
        card: '0 4px 20px -4px rgba(0,0,0,0.03)',
      },
      fontFamily: {
        sans: ['Satoshi', 'system-ui', 'sans-serif'],
        heading: ['"General Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
