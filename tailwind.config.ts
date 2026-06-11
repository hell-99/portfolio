import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:      '#0d1220',
        surface: '#161f35',
        border:  '#2a3a5c',
        green:   '#86efac',
        blue:    '#93c5fd',
        red:     '#fda4af',
        amber:   '#fcd34d',
        purple:  '#c4b5fd',
        pink:    '#f9a8d4',
        muted:   '#64748b',
        text:    '#e2e8f0',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      animation: {
        'scan':   'scan 4s ease-in-out infinite',
        'blink':  'blink 1s step-end infinite',
        'fadein': 'fadein 0.6s ease forwards',
        'float':  'float 6s ease-in-out infinite',
      },
      keyframes: {
        scan:   { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100vw)' } },
        blink:  { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        fadein: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'none' } },
        float:  { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
    },
  },
  plugins: [],
}
export default config
