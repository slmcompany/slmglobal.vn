import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import robotsTxt from "astro-robots-txt";
import partytown from "@astrojs/partytown";

import playformCompress from "@playform/compress";

// https://astro.build/config
export default defineConfig({
  image: {
    domains: ["api.slmglobal.vn"],
  },
  site: "https://slmglobal.vn",
  integrations: [
    tailwind(),
    sitemap(),
    react(),
    robotsTxt({
      policy: [
        {
          userAgent: "* ",
          allow: "/",
          disallow: ["/~partytown"],
          sitemap: "https://slmglobal.vn/sitemap-index.xml",
        },
      ],
    }),
    playformCompress(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
});
