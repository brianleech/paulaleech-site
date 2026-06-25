// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://brianleech.github.io',
  base: '/paulaleech-site',
  vite: {
    plugins: [tailwindcss()],
    server: {
      // Allow Cloudflare quick tunnels + Netlify previews to reach the dev server.
      // Vite blocks unknown Hosts by default for DNS rebinding protection;
      // for an internal dev tunnel that's overkill. Restrict to known preview hosts.
      allowedHosts: [
        '.trycloudflare.com',
        '.netlify.app',
        'localhost',
        '127.0.0.1',
      ],
    },
  },
});
