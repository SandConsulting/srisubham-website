// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  site: process.env.ASTRO_SITE,
  base: process.env.ASTRO_BASE || '/',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  vite: {
    ssr: {
      external: ['better-sqlite3'],
    },
  },
});
