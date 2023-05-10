import { defineConfig } from 'astro/config';
import vercelEdge from '@astrojs/vercel/edge';
import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercelEdge(),
  integrations: [react(), tailwind()]
});