# Local Development

## Prerequisites

- Node.js 18+
- A Hygraph project with posts (see `docs/hygraph-integration.md`)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.dist .env
   ```
   Fill in your values in `.env`:
   ```
   GRAPH_CMS_URL=https://api-<region>.hygraph.com/v2/<project-id>/master
   GRAPH_CMS_PAT=your-personal-access-token
   VITE_GA_TRACKING_ID=G-XXXXXXXXXX   # optional
   ```

3. **Start the dev server**
   ```bash
   npm run dev
   ```
   The app is available at `http://localhost:5173`.

## How Dev Mode Works

In development, Vite starts a standard SPA server. There is no prerendering — React renders everything client-side.

To keep the Hygraph API token (`GRAPH_CMS_PAT`) off the browser, Vite's built-in proxy forwards all `/graphql` requests from the browser to Hygraph, adding the auth header on the server:

```
Browser → /graphql → Vite dev server → Hygraph API (with Bearer token)
```

This is configured in `vite.config.ts` under `server.proxy`.

The `@netlify/vite-plugin` is also active in dev mode, which means Netlify platform primitives (Edge Functions, environment variables, etc.) are emulated locally without needing the Netlify CLI.

## Building Locally

To test a full production build locally:

```bash
npm run build      # builds client + server bundles + prerenders all pages
npm run preview    # serves the built dist/client/ directory
```

Then open `http://localhost:4173`. You can verify SSG is working by checking that the HTML source of any page contains the full post content (not a JS-rendered shell).
