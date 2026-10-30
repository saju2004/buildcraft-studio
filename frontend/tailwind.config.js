/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        workspace: {
          bg: '#0f1115',
          darker: '#0a0c0e',
          panel: '#16191f',
          surface: '#1c2028',
          card: '#222731',
          border: '#2a313d',
          borderLight: '#384252',
          text: '#f1f5f9',
          muted: '#94a3b8',
          dim: '#64748b'
        },
        cad: {
          blue: '#38bdf8',
          cyan: '#06b6d4',
          accent: '#2563eb',
          wall: '#d97706',
          wallPartition: '#94a3b8',
          column: '#f59e0b',
          grid: '#1e242d',
          gridMajor: '#2d3748',
          snap: '#22c55e',
          dim: '#34d399',
          door: '#60a5fa',
          window: '#38bdf8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}
