import React from "react";
import useFetch from "../../hooks/useFetch";
import Loader from "../../Loader";
import { useParams } from "react-router-dom";
import TrackSearchResult from "../../TrackSearchResult";

export default function PlaylistDetails() {
  const { id } = useParams();
  const { loading, error, value } = useFetch(`playlist/${id}`);

  if (loading) return <Loader />;
  if (error) return <div>Failed to load component.</div>;

  return (
    <div>
      {value.songs && value.songs.length ? (
        value.songs.map((song, id) => <TrackSearchResult track={song} key={id} />)
      ) : (
        <h1>No songs in playlist.</h1>
      )}
    </div>
  );
}
