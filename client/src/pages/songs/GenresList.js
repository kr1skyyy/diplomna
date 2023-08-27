import React from 'react'
import { spotifyApi } from '../../Dashboard';
import Genres from './Genres';
import Loader from '../../Loader';

export default function Songs() {
  const [genres, setGenres] = React.useState([]);

  React.useEffect(() => {
    spotifyApi.getAvailableGenreSeeds()
    .then((data) => {
      setGenres(data.body.genres);
    });
  }, []);

  if (!genres) return <Loader />;

  return (
    <div>
      <h1 className="pb-4">Genres</h1>
      <Genres genres={genres} />
    </div>
  )
};
