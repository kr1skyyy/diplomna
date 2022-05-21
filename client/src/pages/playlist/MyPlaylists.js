import React from "react";
import { useHistory } from 'react-router-dom';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';
import { createUrl, fetch } from "../../util/utils";
import useFetch from "../../hooks/useFetch";
import Loader from "../../Loader";
import Playlist from "./Playlist";

import { blue } from '@mui/material/colors';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import DialogContent from '@mui/material/DialogContent';

export function OpenPlaylistFromURL({ open, setOpen }) {
  const history = useHistory();
  const [url, setUrl] = React.useState('');

  const handleClose = () => setOpen(false);

  const openPlaylist = () => {
    setOpen(false);
    let pattern = createUrl('playlist');
    pattern = pattern.replaceAll('/', '\\/');
    // eslint-disable-next-line no-useless-escape
    pattern += '\/([\\w]+)';
    const match = url.match(new RegExp(pattern, ''));
    if (match[1]) {
      history.push(`/playlist/${match[1]}`);
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Open Playlist</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Place the playlist URL below to load the playlist. Please make sure that the URL is copied from the share playlist button.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Playlist URL"
            type="text"
            fullWidth
            variant="standard"
            onInput={(e) => setUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={openPlaylist}>Open Playlist</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export function NewPlaylist(props) {
  const { open, setOpen, addPlaylist } = props;

  const saveNewPlaylist = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.querySelector('#playlistName').value;
    const response = await fetch(createUrl(`playlist/create?name=${name}`));
    if (response.playlist) addPlaylist(response.playlist);
    setOpen(false);
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
  const { loading, error, value, setValue } = useFetch("playlist/current-user", {}, 'POST');
  const [isOpenAddNewPlaylist, setIsOpenAddNewPlaylist] = React.useState(false);
  const [isOpenPlaylistFromURL, setIsOpenPlaylistFromURL] = React.useState(false);

  const createPlaylist = () => {
    setIsOpenAddNewPlaylist(true);
  };

  const addPlaylist = (playlist) => {
    setValue({ playlists: [...value.playlists, playlist] });
  };

  const removePlaylist = (id) => {
    const playlists = value.playlists.filter((playlist) => playlist.id !== id);
    setValue({ playlists });
  };

  if (loading) return <Loader />;
  if (!value || error) return <h1>Error</h1>;

  return (
    <div>
      {isOpenAddNewPlaylist && <NewPlaylist open={isOpenAddNewPlaylist} setOpen={setIsOpenAddNewPlaylist} addPlaylist={addPlaylist} />}
      {isOpenPlaylistFromURL && <OpenPlaylistFromURL open={isOpenPlaylistFromURL} setOpen={setIsOpenPlaylistFromURL} addPlaylist={addPlaylist} />}

      <h1 className="pb-4">Your playlists</h1>

      {value.playlists?.length ? (
        <div className="row">
          {value.playlists.map((playlist, index) => (
            <div className="col-12 col-md-6 col-lg-4 mb-4" key={index}>
              <Playlist playlist={playlist} removePlaylist={removePlaylist} />
            </div>
          ))}
        </div>
      ) : (
        <div>No Playlists</div>
      )}

      <Fab onClick={() => setIsOpenPlaylistFromURL(true)} variant="extended" style={{ cursor: 'pointer', backgroundColor: blue[300], color: '#fff', position: 'absolute', right: 230, bottom: 110 }} aria-label="share">
        <ShareIcon />
        <span className="pl-1">Open playlist from URL</span>
      </Fab>

      <Fab onClick={createPlaylist} color="primary" variant="extended" style={{ cursor: 'pointer', position: 'absolute', right: 35, bottom: 110 }} aria-label="add">
        <AddIcon />
        <span className="pl-1">Create playlist</span>
      </Fab>
    </div>
  );
}
