# Spotify Integration

The `/playlists` page lists the public playlists on one Spotify account, rendered as a grid of cards linking out to Spotify. It's currently **unlinked from site navigation** — reachable only by visiting `/playlists` directly.

## Auth: Client Credentials flow

Unlike Hygraph, Spotify's playlists endpoint needs OAuth. This integration uses the [Client Credentials flow](https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow) — an app-only token, no user login or consent screen. Under this flow, `GET /v1/users/{user_id}/playlists` only ever returns that user's **public** playlists, which is exactly what this page needs.

The token exchange and the playlists fetch both happen in `scripts/spotify.ts`, shared by two callers:

- **Build time**: `scripts/prerender.ts` calls it directly, writes `/data/playlists.json`, and prerenders `/playlists/index.html` — same pattern as posts and poems.
- **Dev time**: a Vite middleware in `vite.config.ts` (`spotifyPlaylistsDevMiddleware`) calls it on `/api/spotify/playlists`, so the client secret stays server-side during `npm run dev` too. `src/api/spotify.ts`'s `loadPlaylists()` hits that endpoint in dev.

There's no client-side fallback in production (unlike `loadPosts`/`loadPoems`, which can fall back to hitting Hygraph directly from the browser). A Client Credentials exchange needs the client secret, which must never reach the browser bundle — so in prod, `loadPlaylists()` only ever reads the prerendered `/data/playlists.json`.

## Fail-soft build behavior

Posts and poems are core content — `scripts/prerender.ts` fails the whole build if Hygraph is unreachable. Playlists are a bonus page, so they're handled differently: if the Spotify fetch throws (missing/invalid credentials, API outage, rate limit), `prerender.ts` logs a warning and writes an empty `playlists.json` instead of failing the build. A Spotify hiccup should never take down the rest of the site.

## Setup

1. Register an app at [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) (any name/description; the Redirect URI field is required by the form but unused by this flow — `http://localhost:3000` works).
2. Copy the app's Client ID and Client Secret.
3. Find the account's Spotify user ID — the segment after `/user/` in `open.spotify.com/user/<id>`.
4. Set in `.env` (see `.env.dist`):
   ```
   SPOTIFY_CLIENT_ID=
   SPOTIFY_CLIENT_SECRET=
   SPOTIFY_USER_ID=
   ```

No webhook exists for Spotify — playlist changes only show up on the next deploy (manual, or triggered by publishing a post/poem in Hygraph).
