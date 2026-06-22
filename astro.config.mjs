// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://brianleech.github.io',
  base: '/paulaleech-site',
  vite: {
    plugins: [tailwindcss()]
  }
});