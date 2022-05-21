
import React from "react";
import Loader from "../../Loader";
import TrackSearchResult from "../../TrackSearchResult";
import { createUrl, fetch } from "../../util/utils";
import { useParams } from "react-router-dom";

export default function Chart() {
  const { chart } = useParams();

  const [songs, setSongs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetch(createUrl(`chart/${chart}`))
      .then((res) => {
        const songs = [];
        const songsInList = {};

        setLoading(false);
        (res.songs || []).forEach((song) => {
          if (song && song.id && !songsInList[song.id]) {
            songs.push(song);
            songsInList[song.id] = true;
          }
        })

        setSongs(songs);
      })
      .catch((e) => setError(e));
  
  }, [chart]);

  if (loading) return <Loader />;
  if (error) return <div>Failed to load component.</div>;
    
  return (
    <div>
      {songs && songs.length ? (
        songs
          .sort((a, b) => b.listened - a.listened)
          .map((song, id) => <TrackSearchResult track={song} key={id} id={id} />)
      ) : (
        <h1>No songs in playlist.</h1>
      )}
    </div>
  );
}