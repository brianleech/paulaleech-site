// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// Detect the build environment:
// - Netlify sets NETLIFY=true and provides URL/DEPLOY_PRIME_URL
// - GitHub Actions building for Pages keeps the legacy base path
const isNetlify = process.env.NETLIFY === 'true';

// https://astro.build/config
export default defineConfig({
  // On Netlify the site lives at the apex of its assigned domain, so we drop the
  // /paulaleech-site/ subdirectory used for GitHub Pages. Local dev mirrors the
  // GitHub Pages layout to keep parity with production-as-of-now.
  site: isNetlify
    ? (process.env.URL || 'https://paulaleechsite.netlify.app')
    : 'https://brianleech.github.io',
  base: isNetlify ? '/' : '/paulaleech-site',
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
