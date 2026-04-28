# Netlify Deployment

The blog is deployed as a fully static site on Netlify. Pages are pre-rendered at build time and served from Netlify's CDN.

## Build Configuration

`netlify.toml` at the project root:

```toml
[build]
  command = "npm run build"
  publish = "dist/client"

[[redirects]]
  from = "/"
  to = "/posts"
  status = 301
  force = true

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

- **`command`**: runs the full build — Vite client bundle, Vite SSR bundle, and the prerender script.
- **`publish`**: the output directory Netlify serves. Each route is a pre-rendered HTML file inside `dist/client/`.
- **Redirect**: the root `/` redirects to `/posts` (the posts listing page).
- **Headers**: Vite-generated assets get long-lived cache headers (they have content hashes in their filenames).

## Creating a New Netlify Project

1. Push the branch to GitHub.
2. In Netlify, click **Add new site → Import an existing project** → connect GitHub.
3. Select the repository and branch.
4. Build settings are picked up automatically from `netlify.toml`.
5. Add environment variables (Site settings → Environment variables):
   - `GRAPH_CMS_URL`
   - `GRAPH_CMS_PAT`
   - `VITE_GA_TRACKING_ID` (optional)
6. Click **Deploy site**.

## How the Build Works

```
npm run build
  ├── vite build          # bundles React app + assets → dist/client/
  ├── vite build --ssr    # builds server-side render bundle → dist/server/
  └── tsx scripts/prerender.ts
        ├── fetches all posts from Hygraph
        ├── renders each page to HTML (React → string)
        └── writes dist/client/posts/index.html
            dist/client/posts/[slug]/index.html  (one per post)
            dist/client/data/*.json               (static API for client navigation)
```

## No Serverless Functions

Unlike the previous Remix setup, this project has **no runtime serverless functions**. Every request is served from a static HTML file on the CDN. This means:

- Zero cold start latency
- No per-request compute cost
- Simpler architecture (no function logs to debug)

The only "dynamic" behaviour is client-side navigation fetching `/data/*.json` files — which are also static files on the CDN.
