import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@netlify/vite-plugin";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  let cmsUrl: URL;
  try {
    cmsUrl = new URL(env.GRAPH_CMS_URL);
  } catch {
    throw new Error(
      "GRAPH_CMS_URL is missing or malformed. Set it in .env (see .env.dist).",
    );
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      // Disable Netlify's static-file serving in dev. Otherwise the plugin
      // serves the prerendered bundle from `dist/client/` (per netlify.toml's
      // `publish` setting) and short-circuits Vite's HMR module pipeline.
      netlify({ staticFiles: { enabled: false } }),
    ],
    resolve: {
      alias: { "~": path.resolve(__dirname, "src") },
    },
    build: {
      outDir: "dist/client",
      ssrManifest: true,
    },
    server: {
      proxy: {
        "/graphql": {
          target: cmsUrl.origin,
          changeOrigin: true,
          rewrite: () => cmsUrl.pathname,
          headers: {
            Authorization: `Bearer ${env.GRAPH_CMS_PAT}`,
          },
        },
      },
    },
  };
});
