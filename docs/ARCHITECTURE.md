# Architecture

This document describes the architecture, components, dependencies, and Remix features used in the blog.

## Overview

This is a server-side rendered blog application. Content is authored and managed in [Hygraph](https://hygraph.com/) (a headless GraphQL CMS) and fetched at request time via GraphQL queries. The app is built with [Remix](https://remix.run/), styled with [styled-components](https://styled-components.com/), and deployed as a serverless function on [Netlify](https://www.netlify.com/).

### How it works

1. A visitor requests a page (e.g. `/posts` or `/posts/my-article`).
2. Netlify routes the request to a serverless function (`/.netlify/functions/server`).
3. Remix matches the URL to a route module and runs its **loader** on the server.
4. The loader fetches post data from Hygraph via a GraphQL query.
5. Remix renders the React component tree to HTML on the server (SSR), injecting styled-components styles.
6. The browser receives the HTML and hydrates it into a client-side React app.

## Project Structure

```
app/
  api/
    cms.ts              # GraphQL client (Hygraph)
  components/
    AppLayout/          # Root layout wrapper (centered, max-width container)
    Article/            # Full post detail view
    CommentSection/     # Utterances-based comment widget
    Header/             # Fixed header with title and social links
    PostItem/           # Post summary card for listing pages
    Tabs/               # Tech / Non-tech post filter tabs
    Tag/                # Tag badge component
  constants/
    index.ts            # POST_TYPE enum (tech, non-tech)
  routes/
    index.tsx           # Homepage (redirects to posts)
    posts/
      index.tsx         # Post listing with filtering
      $slug.tsx         # Individual post page
  styles/
    global.css          # Global styles
    normalize.css       # Browser normalization
    reset.css           # CSS reset
    typography.css      # Font faces and base typography
    utils/
      device.ts         # Responsive breakpoint helpers
  types/
    post.type.ts        # Post type definition
    tag.type.ts         # Tag type definition
    ga-events.type.ts   # Google Analytics event enums
    script-config.type.ts
  utils/
    calculateReadTime.ts  # Estimated read time (255 wpm)
    date.ts               # Date formatting
    gtags.client.ts       # Google Analytics helpers
  entry.client.tsx      # Client-side hydration
  entry.server.tsx      # Server-side rendering with styled-components
  root.tsx              # Root component (meta, links, GA, error boundary)

public/
  fonts/                # Self-hosted fonts (PT Sans, Oswald)
  *.svg                 # Social media icons

server.js              # Netlify serverless function handler
remix.config.js        # Remix configuration
netlify.toml           # Netlify build and routing config
```

## Components

### AppLayout

Wraps all page content in a centered container with a max-width of 768px and responsive padding. Every route renders inside this layout.

### Header

Fixed-position header at the top of every page. Displays the blog title ("Will Soares") as a link to the homepage and a row of social media icon links (GitHub, LinkedIn, Twitter, Spotify). Social link clicks are tracked via Google Analytics.

### Tabs

Renders two filter tabs on the post listing page: "tech posts" and "everything else". Each tab is a Remix `<Link>` that navigates to `/posts?type=tech` or `/posts?type=non-tech`. The active tab is highlighted with a bottom border accent.

### PostItem

A card component used in the post listing. Displays the post title (as a link), publication date, estimated read time, tags, and a short description. Prefetches the post on hover using Remix's `prefetch="intent"`. Tracks clicks via Google Analytics.

### Article

Renders a full blog post. Parses the post's markdown content to HTML using `marked`, displays an optional cover image with credits, and shows metadata (date, read time, tags). Code blocks in posts are syntax-highlighted with `highlight.js` on the client side.

### CommentSection

Loads the [Utterances](https://utteranc.es/) widget, which uses GitHub issues for comments. Configured to use the `willamesoares/blog` repository, the `icy-dark` theme, and maps comments to posts by title.

### Tag

A simple styled badge that displays a tag name with a light blue background.

## Content Management

All blog content lives in Hygraph. There are no local markdown files. The app queries Hygraph's GraphQL API at request time using the `graphql-request` library.

### CMS Client (`app/api/cms.ts`)

A generic `fetchCms` function creates an authenticated `GraphQLClient` instance using the `GRAPH_CMS_URL` and `GRAPH_CMS_PAT` environment variables, then executes the given query.

### Post Schema

Posts in Hygraph have the following fields:

| Field | Type | Description |
|---|---|---|
| `title` | String | Post title |
| `slug` | String | URL-friendly identifier |
| `date` | Date | Publication date |
| `description` | String | Short summary |
| `content` | String | Full post body in markdown |
| `isTech` | Boolean | Whether the post is tech-related |
| `tags` | Tag[] | Associated tags (each with `id` and `name`) |
| `coverImage` | Asset | Optional cover image |
| `coverImageCredits` | String | Optional image attribution (markdown) |

### Post Types

Posts are categorized as "tech" or "non-tech" using the `isTech` boolean field. The Tabs component filters posts by passing a `type` query parameter, which the loader maps to the `isTech` variable in the GraphQL query.

## Dependencies

### Runtime

| Package | Purpose |
|---|---|
| `remix` (v1.3.2) | Full-stack web framework |
| `@remix-run/react` | Remix React bindings (Link, useLoaderData, Meta, etc.) |
| `@remix-run/netlify` | Remix adapter for Netlify serverless functions |
| `@netlify/functions` | Netlify serverless function utilities |
| `react` / `react-dom` (v17) | UI library |
| `graphql` + `graphql-request` | GraphQL client for querying Hygraph |
| `styled-components` (v5) | CSS-in-JS styling |
| `marked` | Markdown-to-HTML parser for post content |
| `highlight.js` | Syntax highlighting for code blocks in posts |
| `cross-env` | Cross-platform environment variable setting in npm scripts |

### Development

| Package | Purpose |
|---|---|
| `@remix-run/dev` | Remix dev server and build tooling |
| `@remix-run/eslint-config` | ESLint configuration for Remix projects |
| `eslint` | JavaScript/TypeScript linter |
| `typescript` (v4.5) | TypeScript compiler |
| `@types/react`, `@types/react-dom`, `@types/marked`, `@types/styled-components` | TypeScript type definitions |

## Remix Features

### Server-Side Rendering (SSR)

Every page is rendered to HTML on the server before being sent to the browser. This is handled by `app/entry.server.tsx`, which uses Remix's `renderToString` along with styled-components' `ServerStyleSheet` to extract and inject CSS during the server render. The browser then hydrates the HTML into an interactive React app via `app/entry.client.tsx`.

### Loaders

Loaders are server-side functions that run before a route renders. They fetch data and return it to the component. This project uses loaders in every route:

- **`app/routes/posts/index.tsx`** -- Reads the `type` query parameter from the URL, maps it to the `isTech` GraphQL variable, and fetches the matching posts from Hygraph.
- **`app/routes/posts/$slug.tsx`** -- Extracts the `slug` param from the URL, fetches the corresponding post from Hygraph, and throws a 404 response if not found.
- **`app/root.tsx`** -- Exposes the `GA_TRACKING_ID` environment variable to the client for Google Analytics.

### Route Params

The `$slug.tsx` filename uses Remix's dynamic segment syntax. The `$slug` portion becomes a route parameter accessible in the loader via `params.slug`. This enables URLs like `/posts/my-first-post` to be matched and resolved to the correct post.

### Nested Routes and Outlet

The root route (`app/root.tsx`) renders an `<Outlet />` component, which acts as a placeholder for child route content. When a user navigates to `/posts`, Remix renders the root layout and fills the outlet with the posts index route. When navigating to `/posts/some-slug`, the outlet renders the post detail route instead.

### Links and Meta

Remix provides `links` and `meta` exports for managing `<link>` and `<meta>` tags in the document head:

- **`links`** in `app/root.tsx` loads global CSS files (reset, normalize, typography, global styles) and the highlight.js theme stylesheet.
- **`meta`** in `app/root.tsx` sets default meta tags (charset, description, viewport, Open Graph, Twitter card). Individual routes can override or extend these.

### Prefetching

The `PostItem` component uses Remix's `<Link prefetch="intent">`, which prefetches the target route's data and assets when the user hovers over the link. This makes navigation feel instant.

### Error Boundaries

The root route defines a `CatchBoundary` that catches thrown responses (e.g., 404s from the post loader) and displays a user-friendly error page with the status code and message.

### useLoaderData

Components access data returned by their route's loader using the `useLoaderData` hook. For example, the posts index component calls `useLoaderData()` to get the list of posts fetched by its loader.

### useSearchParams

The posts index route uses `useSearchParams()` to read the current `type` query parameter from the URL, which determines which tab is active in the UI.

## Styling

The project uses **styled-components** for component-scoped CSS-in-JS styling. Each component has a co-located `.styles.ts` file that exports styled elements.

Global styles are loaded as plain CSS files via the Remix `links` export:
- `reset.css` -- CSS reset
- `normalize.css` -- Browser normalization
- `typography.css` -- Font face declarations (PT Sans and Oswald, self-hosted) and base typography
- `global.css` -- HTML5 element defaults and heading styles

Responsive breakpoints are defined in `app/styles/utils/device.ts` and used in styled-components template literals (e.g., `@media ${device.tablet.min}`).

## Google Analytics

Google Analytics is optionally enabled via the `GA_TRACKING_ID` environment variable. When set (and not in development mode), the root route injects the gtag.js script. Two tracking utilities in `app/utils/gtags.client.ts` handle:

- **Page views** -- tracked on every route change via a `useEffect` in the root component.
- **Custom events** -- tracked for post clicks (categorized as tech or non-tech) and social link clicks.
