# Personal Blog

Built with [React](https://react.dev/) and [Vite](https://vite.dev/), deployed on [Netlify](https://www.netlify.com/) as a static site. Posts are managed through [Hygraph](https://hygraph.com/), a GraphQL-based headless CMS.

Pages are pre-rendered at build time (SSG) from Hygraph content and served from Netlify's CDN — no serverless functions at runtime.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- A [Hygraph](https://hygraph.com/) account with a configured project

## Getting Started

### 1. Install dependencies

```sh
npm install
```

### 2. Set up environment variables

```sh
cp .env.dist .env
```

Fill in the values in `.env`:

| Variable | Required | Description |
|---|---|---|
| `GRAPH_CMS_URL` | Yes | Hygraph GraphQL API endpoint |
| `GRAPH_CMS_PAT` | Yes | Hygraph Personal Access Token |
| `VITE_GA_TRACKING_ID` | No | Google Analytics measurement ID (e.g. `G-XXXXXXXXXX`) |

### 3. Start the development server

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the blog.

No Netlify CLI needed — Vite handles local development directly.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production (client bundle + SSR bundle + prerender all pages) |
| `npm run preview` | Serve the production build locally |

## How the Build Works

```
npm run build
  ├── vite build                   # bundles React app + assets → dist/client/
  ├── vite build --ssr             # builds server-side render bundle → dist/server/
  └── tsx scripts/prerender.ts
        ├── fetches all posts from Hygraph
        ├── renders each page to HTML
        └── writes dist/client/index.html              (tech posts list)
            dist/client/non-tech/index.html             (off-topic posts list)
            dist/client/post/[slug]/index.html          (one per post)
            dist/client/data/*.json                     (static data for client navigation)
```

## Documentation

The `docs/` folder covers the project in more detail:

- [`docs/overview.md`](docs/overview.md) — architecture, project structure, hydration & data flow
- [`docs/local-development.md`](docs/local-development.md) — dev setup and how the Vite proxy works
- [`docs/hygraph-integration.md`](docs/hygraph-integration.md) — GraphQL queries, content model, webhook setup
- [`docs/netlify-deployment.md`](docs/netlify-deployment.md) — deploy process, environment variables, build hooks
- [`docs/contributing.md`](docs/contributing.md) — how to add routes, change Hygraph fields, design tokens, component reference
