import React from "react";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import useFetch from "../../hooks/useFetch";
import Loader from "../../Loader";
import Playlist from "./Playlist";
import { createUrl, fetch, showMsg } from "../../util/utils";

import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogContent from '@mui/material/DialogContent';

export function NewPlaylist(props) {
  const { open, setOpen } = props;

  const saveNewPlaylist = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.querySelector('#playlistName').value;
    const response = fetch(createUrl(`playlist/create?name=${name}`)).finally(() => {
      showMsg(response);
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} >
      <DialogTitle className="mb-2 d-flex justify-content-center">New Playlist</DialogTitle>
      <DialogContent style={{ width: 500 }}>
        <form onSubmit={saveNewPlaylist}>
          <div className="p-2" style={{position: 'relative', top: '-15px'}}>
              <TextField margin="normal" required fullWidth id="playlistName" label="Playlist Name" autoFocus />
          </div>

          <div className="mb-2 d-flex justify-content-center">
            <Button type="button" className="mr-2" onClick={() => setOpen(false)} variant="outlined">Cancel</Button>
            <Button type="submit" variant="contained">Create Playlist</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function MyPlaylists() {
  const { loading, error, value } = useFetch("playlist/current-user");
  const [open, setOpen] = React.useState(false);

  const createPlaylist = () => {
    setOpen(true);
  };

  if (loading) return <Loader />;
  if (!value || error) return <h1>Error</h1>;


  return (
    <div>
      {open && <NewPlaylist open={open} setOpen={setOpen} />}

      {value.playlists?.length ? (
        <div className="row">
          {value.playlists.map((playlist, index) => (
            <div className="col-12 col-md-6 col-lg-4 mb-4" key={index}>
              <Playlist playlist={playlist} />
            </div>
          ))}
        </div>
      ) : (
        <div>No Playlists</div>
      )}

      <Fab onClick={createPlaylist} color="primary" variant="extended" style={{ position: 'absolute', right: 35, bottom: 110 }} aria-label="add">
        <AddIcon />
        <span className="pl-1">Create playlist</span>
      </Fab>
    </div>
  );
}
