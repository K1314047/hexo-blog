import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        bg: 'var(--bg)',
        card: 'var(--card)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        gold: 'var(--gold)'
      },
      boxShadow: {
        soft: '0 10px 35px rgba(15, 23, 42, 0.06)'
      }
    }
  },
  plugins: []
};

export default config;
