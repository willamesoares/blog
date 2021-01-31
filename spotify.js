const getAccessToken = async () => {
  const formData = {
    'grant_type': 'refresh_token',
    'refresh_token': process.env.GATSBY_SPOTIFY_REFRESH_TOKEN,
    'client_id': process.env.GATSBY_SPOTIFY_CLIENT_ID,
    'client_secret': process.env.GATSBY_SPOTIFY_CLIENT_SECRET
  };

  const formDataBody = [];
  for (const d in formData) {
    formDataBody.push(`${encodeURIComponent(d)}=${encodeURIComponent(formData[d])}`);
  }

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formDataBody.join('&')
  });

  const { access_token: accessToken } = await res.json();
  return accessToken;
}

const getPlaylist = async (playlistId = process.env.GATSBY_SPOTIFY_PLAYLIST_ID, token) => {
  const accessToken = token || await getAccessToken();
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return await res.json();
}

const getArtist = async (artistId, token) => {
  const accessToken = token || await getAccessToken();
  const res = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return await res.json();
}

export {
  getAccessToken,
  getPlaylist,
  getArtist
};
