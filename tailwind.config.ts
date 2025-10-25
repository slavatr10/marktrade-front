import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx,html}'],
  theme: {
    extend: {
      colors: {
        modal: '#F6F8FA',
      },
    },
  },
  plugins: [],
} satisfies Config;
