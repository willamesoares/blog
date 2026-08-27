/**
 * Fetches public playlists for one Spotify account via the Client Credentials
 * flow (app-only auth, no user login). `GET /v1/users/{id}/playlists` under
 * this flow only ever returns that user's public playlists.
 */

export type SpotifyPlaylist = {
  id: string;
  name: string;
  description: string;
  url: string;
  image: string | null;
  trackCount: number;
  collaborative: boolean;
};

type Env = Record<string, string | undefined>;

function requireEnv(env: Env, name: string): string {
  const value = env[name];
  if (!value) throw new Error(`${name} environment variable is not set`);
  return value;
}

async function getAccessToken(env: Env): Promise<string> {
  const clientId = requireEnv(env, "SPOTIFY_CLIENT_ID");
  const clientSecret = requireEnv(env, "SPOTIFY_CLIENT_SECRET");
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    throw new Error(`Spotify token request failed: ${res.status}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

function toSpotifyPlaylist(item: any): SpotifyPlaylist {
  return {
    id: item.id,
    name: item.name,
    description: item.description ?? "",
    url: item.external_urls?.spotify ?? "",
    image: item.images?.[0]?.url ?? null,
    trackCount: item.tracks?.total ?? 0,
    collaborative: item.collaborative ?? false,
  };
}

async function fetchPlaylistById(
  id: string,
  token: string,
): Promise<SpotifyPlaylist | null> {
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${encodeURIComponent(id)}?fields=id,name,description,external_urls,images,tracks.total,collaborative`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!res.ok) return null;
  return toSpotifyPlaylist(await res.json());
}

export async function fetchPublicPlaylists(
  env: Env = process.env,
): Promise<SpotifyPlaylist[]> {
  const userId = requireEnv(env, "SPOTIFY_USER_ID");
  const token = await getAccessToken(env);

  const playlists: SpotifyPlaylist[] = [];
  const seenIds = new Set<string>();
  let url: string | null =
    `https://api.spotify.com/v1/users/${encodeURIComponent(userId)}/playlists?limit=50`;

  while (url) {
    const res: Response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error(`Spotify playlists request failed: ${res.status}`);
    }

    const data = await res.json();

    // Spotify returns `null` entries in `items` for playlists that became
    // unavailable (e.g. deleted) since being added to the user's library.
    for (const item of data.items ?? []) {
      if (!item) continue;
      playlists.push(toSpotifyPlaylist(item));
      seenIds.add(item.id);
    }

    url = data.next ?? null;
  }

  // This list endpoint occasionally omits playlists that Spotify's own
  // single-playlist endpoint reports as public and owned by this account —
  // a confirmed inconsistency between the two, not a pagination bug.
  // SPOTIFY_EXTRA_PLAYLIST_IDS is a manual allowlist to paper over that gap.
  const extraIds = (env.SPOTIFY_EXTRA_PLAYLIST_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  for (const id of extraIds) {
    if (seenIds.has(id)) continue;
    const playlist = await fetchPlaylistById(id, token);
    if (playlist) {
      playlists.push(playlist);
      seenIds.add(id);
    }
  }

  return playlists;
}
