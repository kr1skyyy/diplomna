import { useState, useEffect } from 'react';
import useAuth from './useAuth';
import Player from './Player';
import TrackSearchResult from './TrackSearchResult';
import { Form } from 'react-bootstrap';
import SpotifyWebApi from 'spotify-web-api-node';
import Drawer from './layout/Drawer';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const spotifyApi = new SpotifyWebApi({
  clientId: '2736f0fba5bd47febe645ba84dc7fa05',
});

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();

  function chooseTrack(track) {
    setPlayingTrack(track);
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
    <Router>
      <Drawer>
        <Switch>
          <Route path="/a">
            <h1>Hi</h1>
          </Route>
          <Route path="/">
            <Form.Control
              type='search'
              placeholder='Search Songs/Artists'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className='flex-grow-1 my-2' style={{ overflowY: 'auto' }}>
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
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </Router>
  )
}
