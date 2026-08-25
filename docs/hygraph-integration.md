# Hygraph Integration

The blog uses [Hygraph](https://hygraph.com) as a headless CMS. All content (posts, tags) is managed there and fetched via GraphQL.

## GraphQL Queries

### Fetch posts list

Used in `scripts/prerender.ts` and `src/pages/Posts.tsx`:

```graphql
query Posts {
  posts {
    title
    content
    date
    description
    slug
    tags {
      ... on Tag {
        name
      }
    }
  }
}
```

All posts are fetched in one request — the home page lists everything and lets visitors filter client-side by tag (see `TagFilter` in `docs/contributing.md`).

### Fetch a single post

Used in `scripts/prerender.ts` and `src/pages/Post.tsx`:

```graphql
query MyQuery($slug: String!) {
  post(where: { slug: $slug }) {
    title
    content
    date
    description
    id
    slug
    tags {
      ... on Tag {
        id
        name
      }
    }
    coverImage {
      url
    }
    coverImageCredits
  }
}
```

## API Client

The GraphQL client lives in `src/api/cms.ts`. It uses `graphql-request`.

- **Build time (prerender script)**: connects directly to Hygraph using `GRAPH_CMS_URL` and `GRAPH_CMS_PAT`.
- **Dev mode**: connects through Vite's proxy at `/graphql` so the token stays server-side.

## Content Model

Your Hygraph schema should have:

- **Post** model with fields:
  - `title` (String)
  - `slug` (String, unique)
  - `date` (Date)
  - `description` (String)
  - `content` (String — Markdown)
  - `tags` (relation to Tag)
  - `coverImage` (Asset, optional)
  - `coverImageCredits` (String, optional — supports Markdown)

- **Tag** model with fields:
  - `name` (String)

## Webhook Setup (Auto-Deploy on Content Change)

When you publish a post in Hygraph, you want the site to rebuild automatically.

1. **In Netlify**: go to Site settings → Build & deploy → Build hooks → Add build hook. Name it "Hygraph" and copy the URL.

2. **In Hygraph**: go to Project settings → Webhooks → Create webhook:
   - Trigger: `Published` on the `Post` model
   - URL: paste the Netlify build hook URL
   - Method: POST

After this, publishing a post in Hygraph will trigger a Netlify rebuild. The site updates in ~1–2 minutes.
