import React, { useEffect, useState } from 'react';
import { getArtist, getAccessToken, getPlaylist } from '../../spotify';
import { Link } from 'gatsby';

import Layout from '../components/layout';
import Spinner from '../components/loading';
import SEO from '../components/seo';

import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  '@global': {
    '@keyframes animateBg': {
      '0%': {
        backgroundPosition: '100% 0'
      },
      '100%': {
        backgroundPosition: '0 0'
      }
    }
  },
  loader: {
    animation: 'animateBg 2s infinite linear',
    backgroundColor: '#fff',
    backgroundImage: 'linear-gradient(90deg, #726c6b9e, #464648a8, #726c6b9e, #464648a8)',
    backgroundSize: '300% 100%',
    boxShadow: '0 3px 14px #000',
    height: '200px',
    width: '200px',
    zIndex: -1
  }
});

const SongCard = ({ id, artist }) => {
  const [isLoadingIFrame, setIsLoadingIFrame] = useState(true);
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  const styles = useStyles();

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
      <img
        alt={artist.name}
        src={artist.imageSrc}
        style={{ width: '250px', margin: 0, maxHeight: '250px' }}
        onLoad={() => setIsLoadingImage(false)}
      />
      { isLoadingIFrame && !isLoadingImage ? (
        <div
          className={styles.loader}
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '3.8rem'
          }}>
        </div>
      ) : null }
      <iframe
        title="Spotify"
        style={{ margin: 0, borderRadius: '0 0 .4rem .4rem' }}
        src={`https://open.spotify.com/embed/track/${id}`}
        width="250"
        height="80"
        frameBorder="0"
        allowtransparency="true"
        allow="encrypted-media"
        onLoad={() => setIsLoadingIFrame(false)}>
      </iframe>
    </div>
  );
};

const Playlist = (props) => {
  const { data, location } = props;
  const siteTitle = data.site.siteMetadata.title;
  const [trackList, setTrackList] = useState([]);

  useEffect(() => {
    (async () => {
      const accessToken = await getAccessToken();
      const playlistData = await getPlaylist(process.env.GATSBY_SPOTIFY_PLAYLIST_ID, accessToken);

      const list = [];
      for (const track of playlistData.items) {
        const {
          track: {
            artists = [],
            id: trackId
          } = {}
        } = track;
        const artistId = (artists[0] || {}).id;

        let artistData;
        if (artistId) {
          artistData = await getArtist(artistId, accessToken);
        }

        list.push({
          id: trackId,
          artist: {
            imageSrc: artistData.images[0].url
          }
        });
      }

      setTrackList(list);
    })();
  }, []);

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
        { trackList.length ? trackList.map(t => <SongCard key={t.id} {...t} />) : <Spinner /> }
      </div>
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
