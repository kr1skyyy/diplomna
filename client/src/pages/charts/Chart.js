
import React from "react";
import useFetch from "../../hooks/useFetch";
import Loader from "../../Loader";
import { useParams } from "react-router-dom";
import TrackSearchResult from "../../TrackSearchResult";

export default function Chart() {
  const { chart } = useParams();

  const { loading, error, value } = useFetch(`chart/${chart}`);

  if (loading) return <Loader />;
  if (error) return <div>Failed to load component.</div>;

  return (
    <div>
      {value.songs && value.songs.length ? (
        value.songs.map((song) => <TrackSearchResult track={song} />)
      ) : (
        <h1>No songs in playlist.</h1>
      )}
    </div>
  );
}