import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@netlify/vite-plugin";
import fs from "fs";
import path from "path";

// Mirror Netlify's "pretty URLs" behavior in `vite preview`: for an
// extensionless request like /non-tech, prefer /non-tech/index.html before
// falling back to the SPA's root /index.html. Without this, vite preview
// serves the root HTML for every unknown path, which embeds the wrong
// `__INITIAL_DATA__` and only recovers after the client refetches.
function netlifyPrettyUrlsPreview(): Plugin {
  return {
    name: "netlify-pretty-urls-preview",
    configurePreviewServer(server) {
      const root = path.resolve(__dirname, "dist/client");
      server.middlewares.use((req, _res, next) => {
        if (req.url && !path.extname(req.url.split("?")[0])) {
          const clean = req.url.split("?")[0].replace(/\/$/, "");
          const candidate = path.join(root, clean, "index.html");
          if (fs.existsSync(candidate)) req.url = clean + "/";
        }
        next();
      });
    },
  };
}

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
      // Disable Netlify's static-file serving only in dev. Otherwise the plugin
      // serves the prerendered bundle from `dist/client/` (per netlify.toml's
      // `publish` setting) and short-circuits Vite's HMR module pipeline.
      // In preview/build we want it on so pretty URLs (/foo → /foo/index.html)
      // and netlify.toml redirects mirror production behavior.
      netlify({ staticFiles: { enabled: mode !== "development" } }),
      netlifyPrettyUrlsPreview(),
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
