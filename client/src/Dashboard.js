import { useState, useEffect } from 'react';
import { Switch, Route } from "react-router-dom";
import { Form } from 'react-bootstrap';
import useAuth from './hooks/useAuth';
import Player from './Player';
import TrackSearchResult from './TrackSearchResult';
import SpotifyWebApi from 'spotify-web-api-node';
import Drawer from './layout/Drawer';
import MyPlaylists from './pages/playlist/MyPlaylists';
import Songs from './pages/songs/Songs';
import GenreDetails from './pages/songs/GenreDetails';
import PlaylistDetails from './pages/playlist/PlaylistDetails';
import Charts from './pages/charts/Charts';
import Chart from './pages/charts/Chart';
import Home from './pages/Home';

export const spotifyApi = new SpotifyWebApi({
  clientId: '2736f0fba5bd47febe645ba84dc7fa05',
});

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [message, setMessage] = useState(null);

  document.addEventListener('play-track', (e) => {
    const { song } = e.detail;
    setPlayingTrack(song);
  });

  document.addEventListener('show-message', (e) => {
    const msg = e.detail.msg;
    setMessage(msg);

    setTimeout(() => {
      setMessage(null);
    }, 4000);
  })

  function chooseTrack(track) {
    document.dispatchEvent(new CustomEvent('play-track', { detail: { song: track } }));
    setSearch('');
  }

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken])

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false
    spotifyApi.searchTracks(search).then(res => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map(track => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          )

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          }
        })
      )
    })

    return () => (cancel = true);
  }, [search, accessToken]);

  return (
    <>
      {message ? message : null}
      <Drawer>
        <Switch>
          <Route path="/MyPlaylists">
            <MyPlaylists/>
          </Route>
          <Route path="/playlist/:id">
            <PlaylistDetails />
          </Route>
          <Route path="/Songs">
            <Songs/>
          </Route>
          <Route path="/Genres/:genre">
            <GenreDetails />
          </Route>
          <Route path="/Charts/:chart">
            <Chart />
          </Route>
          <Route path="/Charts">
            <Charts />
          </Route>
          <Route path="/">
            <Form.Control
              type='search'
              placeholder='Search Songs/Artists'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {!search && <Home />}
            <div className='flex-grow-1 my-2'>
              {searchResults.map(track => (
                <TrackSearchResult
                  track={track}
                  key={track.uri}
                  chooseTrack={chooseTrack}
                />
              ))}
            </div>
          </Route>
        </Switch>
      </Drawer>
      <div className="d-flex align-items-center" style={{ position: 'absolule', bottom: 0, height: 100, padding: '0 20px' }}>
        <Player accessToken={accessToken} trackUri={playingTrack?.uri || playingTrack?.id} />
      </div>
    </>
  )
}
