import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"
import { createUrl, fetch } from "./util/utils"

export default function Player({ accessToken }) {
  const [play, setPlay] = useState(true)
  const [playQueue, setPlayQueue] = useState([]);
  const [requestInProgress, setRequestInProgress] = useState(false);

  useEffect(() => {
    const setPlayerSongs = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
  
      const { song, playlist } = e.detail;
      if (song) {
        setPlayQueue([song.uri || song.id]);
      } else {
        setPlayQueue(playlist || []);
      }
    };

    document.removeEventListener('set-player-songs', setPlayerSongs);
    document.addEventListener('set-player-songs', setPlayerSongs);
  }, [accessToken]);
  
  useEffect(() => setPlay(true), [playQueue]);

  if (!accessToken) return null
  return (
    <SpotifyPlayer
      token={accessToken}
      callback={state => {
        if (!state.isPlaying) setPlay(false)
        if (state.position.toFixed(2) === '0.00' && state.isPlaying && !requestInProgress) {
          setRequestInProgress(true);
          fetch(createUrl('chart/user-plays/'), state.track, 'POST')
            .finally(() => {
              setRequestInProgress(false);
            });
        }
      }}
      play={play}
      uris={playQueue ? [...playQueue] : []}
    />
  )
}

// Callback state ^
// export interface State {
//   currentDeviceId: string;
//   deviceId: string;
//   devices: SpotifyDevice[];
//   error: string;
//   errorType: string;
//   isActive: boolean;
//   isInitializing: boolean;
//   isMagnified: boolean;
//   isPlaying: boolean;
//   isSaved: boolean;
//   isUnsupported: boolean;
//   needsUpdate: boolean;
//   nextTracks: WebPlaybackTrack[];
//   playerPosition: 'bottom' | 'top';
//   position: number;
//   previousTracks: WebPlaybackTrack[];
//   progressMs: number;
//   status: string;
//   track: SpotifyPlayerTrack;
//   volume: number;
// }