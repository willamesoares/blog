import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton'
import { Link } from 'gatsby';

import {
  getAccessToken,
  getArtist,
  getPlaylist
} from '../../spotify';
import Layout from '../components/layout';
import SEO from '../components/seo';

const SongCard = ({ songId, artistId, accessToken }) => {
  const [isLoadingIFrame, setIsLoadingIFrame] = useState(true);
  const [artist, setArtist] = useState({});

  useEffect(() => {
    (async () => {
      const artistData = await getArtist(artistId, accessToken);

      setArtist({
        imageSrc: artistData.images[0].url
      })
    })();
  }, [accessToken, artistId]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '250px',
        margin: '0 0 1rem',
        borderRadius: '.4rem',
        overflow: 'hidden',
        position: 'relative',
        alignSelf: 'flex-start'
      }}
    >
      {!artist.imageSrc ? <Skeleton height={250} /> : (
        <div
          style={{
            width: '250px',
            margin: 0,
            height: '250px',
            backgroundImage: `url(${artist.imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}

      <iframe
        title="Spotify"
        style={{
          margin: 0,
          borderRadius: '0 0 .4rem .4rem',
          display: isLoadingIFrame ? 'none' : 'block'
        }}
        src={`https://open.spotify.com/embed/track/${songId}`}
        width="250"
        height="80"
        frameBorder="0"
        allowtransparency="true"
        allow="encrypted-media"
        onLoad={() => setIsLoadingIFrame(false)}>
      </iframe>
      { isLoadingIFrame ? <Skeleton height={80} /> : null }
    </div>
  );
};

const Playlist = (props) => {
  const { data, location } = props;
  const siteTitle = data.site.siteMetadata.title;
  const [playlist, setPlaylist] = useState([]);
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    (async () => {
      const token = await getAccessToken();
      setAccessToken(token);
    })();
  }, []);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    (async () => {
      const playlistData = await getPlaylist(
        process.env.GATSBY_SPOTIFY_PLAYLIST_ID,
        accessToken
      );

      const list = [];
      for (const track of playlistData.items) {
        const {
          track: {
            artists = [],
            id: songId
          } = {}
        } = track;
        const artistId = (artists[0] || {}).id;

        list.push({
          songId: songId,
          artistId
        });
      }

      setPlaylist(list);
    })();
  }, [accessToken]);

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Favorite Songs" />
      <h1 style={{ textAlign: 'center', marginTop: 0 }}>Favorite Songs by Artist</h1>
      <div
        style={{
          textAlign: 'center',
          fontSize: '.7rem',
          textDecoration: 'none',
          marginBottom: '.8rem'
        }}
      >
        <Link to={`/`}>home</Link>
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly'
        }}
      >
        { playlist.map(song => (
          <SongCard
            accessToken={accessToken}
            key={song.songId}
            {...song}
          />
        )) }
      </div>
      { !playlist.length ? <Skeleton /> : null }
    </Layout>
  );
}

export default Playlist;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
