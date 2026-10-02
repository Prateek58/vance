// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default <Config>{
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00D2F1',
        secondary: '#00E7AF',
        darkBody: '#171647',
      },
    },
  },
  plugins: [],
};
