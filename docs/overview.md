# Project Overview

A personal blog built with React, Vite, and Tailwind CSS. Content is managed in Hygraph (a headless CMS) and fetched via GraphQL at build time to generate a fully static site deployed on Netlify.

## Architecture

```
Hygraph (CMS)
    │
    │  GraphQL (at build time only)
    ▼
Prerender script (scripts/prerender.ts)
    │
    ├── Generates /posts/index.html
    ├── Generates /posts/[slug]/index.html  (one per post)
    └── Generates /data/*.json              (static API for client navigation)
    │
    ▼
Netlify CDN
    │
    ▼
Browser
  ├── Receives full HTML (good for SEO, fast first load)
  └── React hydrates → client-side navigation via React Router
```

## Tech Stack

| Concern | Tool |
|---|---|
| UI framework | React 18 |
| Build tool | Vite 6 |
| Routing | React Router 6 |
| Rendering | SSG (Static Site Generation) |
| Styling | Tailwind CSS v4 |
| CMS | Hygraph (GraphQL) |
| Deployment | Netlify |
| Language | TypeScript 5 |

## Key Files

| File | Purpose |
|---|---|
| `vite.config.ts` | Vite config (plugins, path alias, dev proxy) |
| `src/entry-client.tsx` | Browser entry — hydrates server-rendered HTML |
| `src/entry-server.tsx` | Server entry — renders HTML string for prerender |
| `src/App.tsx` | Route definitions + GA tracking |
| `src/context/PageData.tsx` | Provides pre-fetched data to components (replaces Remix loaders) |
| `scripts/prerender.ts` | SSG build script — fetches data and generates HTML files |

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GRAPH_CMS_URL` | Yes | Hygraph GraphQL endpoint URL |
| `GRAPH_CMS_PAT` | Yes | Hygraph Personal Access Token (server-side only) |
| `VITE_GA_TRACKING_ID` | No | Google Analytics measurement ID (e.g. G-XXXXXXXXXX) |

See `docs/local-development.md` for setup instructions.
