// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  build: {
    // The page's one stylesheet (~33KB) was the only render-blocking request;
    // inlining it removes a round-trip on slow connections (FCP/LCP) at the
    // cost of HTML size — a good trade for a single-page site.
    inlineStylesheets: 'always'
  }
});