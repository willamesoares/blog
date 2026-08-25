# Project Overview

TheMindHopper, a blog built with React, Vite, and Tailwind CSS. Content is managed in Hygraph (a headless CMS) and fetched via GraphQL at build time to generate a fully static site deployed on Netlify.

> Looking for the practical how-tos (adding a route, changing a Hygraph field, design tokens)? See [`contributing.md`](./contributing.md).

## Architecture

```
Hygraph (CMS)
    │
    │  GraphQL (at build time only)
    ▼
Prerender script (scripts/prerender.ts)
    │
    ├── Generates /index.html               (post list, filterable by tag)
    ├── Generates /post/[slug]/index.html   (one per post)
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
| `src/context/PageData.tsx` | Provides pre-fetched boot data to components |
| `scripts/prerender.ts` | SSG build script — fetches data and generates HTML files |

## Project Structure

```
blog/
├── docs/                  Markdown reference docs (this folder)
├── public/                Static assets served as-is (favicon, social SVGs, fonts)
├── scripts/
│   └── prerender.ts       SSG build step — fetches Hygraph + writes HTML files
└── src/
    ├── api/               GraphQL client + loader functions for client-side data fetching
    ├── components/        Reusable UI (Header, AppLayout, PostItem, Article, Tag, TagFilter, ...)
    ├── context/           React contexts — PageData (boot data + bootConsumed flag)
    ├── pages/             Route components (Posts, Post)
    ├── styles/            Tailwind v4 entry + design tokens + highlight.js theme
    ├── types/             Shared TypeScript types (Post, Tag, GA events, ...)
    ├── utils/             Pure helpers (date, calculateReadTime, gtags)
    ├── App.tsx            Top-level routes + GA pageview tracker
    ├── entry-client.tsx   Hydrates the prerendered HTML in the browser
    └── entry-server.tsx   Renders the React tree to a string for prerender
```

## Hydration & Data Flow

The site never fetches Hygraph at runtime in production. Data reaches React by three paths:

1. **Build time (SSG):** `scripts/prerender.ts` fetches Hygraph, calls the SSR `render(url, data)` from `entry-server.tsx`, writes the HTML, and serializes the same payload into `window.__INITIAL_DATA__` on the rendered page.
2. **Hydration:** `entry-client.tsx` reads `window.__INITIAL_DATA__` and passes it to `PageDataProvider`. Pages call `usePageData<T>()` to consume it.
3. **Client-side navigation:** `loadPosts` / `loadPost` in `src/api/cms.ts` fetch the prerendered `/data/*.json` files (or hit Hygraph through the Vite proxy in dev). A module-level `bootConsumed` flag in `src/context/PageData.tsx` ensures the boot payload is used at most once and only when its `type`/`slug` matches the current URL — every later mount refetches.

The home page lists every post (no pagination) and lets visitors filter by one or more tags via a `TagFilter` bar; the selection is kept in the `?tags=` URL search param so it survives reloads and is shareable. Filtering happens entirely client-side against the already-fetched post list — there's no per-tag-combination prerendering.

### Entry points

The same `<App />` is rendered through two different entry files because SSG and the browser need different React runtimes:

| | `entry-server.tsx` | `entry-client.tsx` |
|---|---|---|
| Runs in | Node, at build time | Browser, on every page load |
| React API | `renderToString` (`react-dom/server`) | `hydrateRoot` (prod) / `createRoot` (dev) |
| Router | `StaticRouter` (route from a fixed URL) | `BrowserRouter` (real history + click handling) |
| Boot data | Passed in by `prerender.ts` as a function arg | Read from `window.__INITIAL_DATA__` |
| Loads CSS | No | Yes — `import '~/styles/index.css'` |
| Output | An HTML string spliced into `index.html` | An attached React root running in the page |

The dev-only `createRoot` branch in `entry-client.tsx` exists because the dev `index.html` only contains the `<!--app-html-->` placeholder comment — there's no SSR markup to hydrate against, and React 18 silently drops state updates if the trees don't match. In production, `hydrateRoot` attaches to the prerendered DOM without re-rendering.

The server bundle ends up at `dist/server/entry-server.js` after `vite build --ssr` and is `import()`ed by `scripts/prerender.ts`. It's never deployed — Netlify only publishes `dist/client/`.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GRAPH_CMS_URL` | Yes | Hygraph GraphQL endpoint URL |
| `GRAPH_CMS_PAT` | Yes | Hygraph Personal Access Token (server-side only) |
| `VITE_GA_TRACKING_ID` | No | Google Analytics measurement ID (e.g. G-XXXXXXXXXX) |

See `docs/local-development.md` for setup instructions.
