import React from "react";
import { spotifyApi } from "../../Dashboard";
import { useParams } from "react-router-dom";
import Loader from "../../Loader";
import TrackSearchResult from "../../TrackSearchResult";

export default function GenreDetails() {
  const [tracks, setTracks] = React.useState([]);
  const { genre } = useParams();

  const playTrack = (song) => {
    document.dispatchEvent(new CustomEvent('set-player-songs', { detail: { song } }));
  };

  React.useEffect(() => {
    spotifyApi
      .searchTracks(`genre:${genre}`)
      .then((data) => {
        setTracks(data.body.tracks.items)
      });
  }, [genre]);

  if (!tracks.length) return <Loader />;

  return (
    <div>
      <h1 className="pb-4">Genre {genre}</h1>
      {tracks.map((track, id) => {
        const smallestAlbumImage = track.album.images.reduce(
          (smallest, image) => {
            if (image.height < smallest.height) return image;
            return smallest;
          },
          track.album.images[0]
        );

        const song = {
          artist: track.artists[0].name,
          title: track.name,
          uri: track.uri,
          albumUrl: smallestAlbumImage.url,
        };
        return <TrackSearchResult track={song} key={id} chooseTrack={() => playTrack(track)}  />
      })}
    </div>
  );
}
