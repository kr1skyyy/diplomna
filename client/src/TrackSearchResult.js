import React from "react"
import AddToPlaylistDialog from "./pages/playlist/AddToPlaylistDialog";

export default function TrackSearchResult({ track, chooseTrack }) {
  function handlePlay() {
    if (chooseTrack) chooseTrack(track);
    document.dispatchEvent(new CustomEvent('play-track', { detail: { song: track } }));
  }

  return (
    <div className="row">
      <div
        className="d-flex m-2 align-items-center col-10"
        style={{ cursor: "pointer" }}
        onClick={handlePlay}
      >
        <img src={track.albumUrl} style={{ height: "64px", width: "64px" }} alt="album" />
        <div className="ml-3">
          <div>{track.title}</div>
          <div className="text-muted">{track.artist}</div>
        </div>
      </div>
      <div className="col">
        <AddToPlaylistDialog track={track}/>
      </div>

    </div>
  )
}
