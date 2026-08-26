import { Playlist } from "~/types";

// In dev: a Vite middleware (see vite.config.ts) performs the Client
// Credentials exchange server-side and returns JSON, keeping the client
// secret out of the browser bundle. In prod: only the prerendered static
// JSON is used — there's no safe way to hit Spotify directly from the
// browser without exposing the client secret, so no live fallback here.

export const loadPlaylists = async (): Promise<{ playlists: Playlist[] }> => {
  if (import.meta.env.DEV) {
    const res = await fetch("/api/spotify/playlists");
    if (!res.ok) throw new Error("Failed to load playlists");
    return res.json();
  }

  const res = await fetch(`/data/playlists.json`);
  if (!res.ok) throw new Error("Failed to load playlists");
  return res.json();
};
