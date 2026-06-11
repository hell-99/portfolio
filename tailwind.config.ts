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
        bg:      '#060912',
        surface: '#0d1117',
        border:  '#21262d',
        green:   '#00ff88',
        blue:    '#00d2ff',
        red:     '#ff4757',
        amber:   '#ffa502',
        purple:  '#a855f7',
        muted:   '#484f58',
        text:    '#e6edf3',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      animation: {
        'scan':    'scan 3s ease-in-out infinite',
        'blink':   'blink 1s step-end infinite',
        'fadein':  'fadein 0.6s ease forwards',
        'glow':    'glow 3s ease-in-out infinite alternate',
        'float':   'float 6s ease-in-out infinite',
        'typing':  'typing 3.5s steps(40,end) forwards',
      },
      keyframes: {
        scan:   { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100vw)' } },
        blink:  { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        fadein: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'none' } },
        glow:   { from: { filter: 'drop-shadow(0 0 8px rgba(0,255,136,0.3))' }, to: { filter: 'drop-shadow(0 0 24px rgba(0,210,255,0.6))' } },
        float:  { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        typing: { from: { width: '0' }, to: { width: '100%' } },
      },
    },
  },
  plugins: [],
}
export default config
