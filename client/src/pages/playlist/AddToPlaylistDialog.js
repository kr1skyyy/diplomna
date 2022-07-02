import * as React from "react";
import { useHistory } from 'react-router-dom';
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import ToggleButton from "@mui/material/ToggleButton";
import { fetch, createUrl } from "../../util/utils";
import Loader from "../../Loader";


function ToggleBtn({ playlist, track }) {
  const [selected, setSelected] = React.useState(playlist.songExists || false);

  const toggleItem = () => {
    const select = !selected;
    fetch(
      createUrl(`playlist/${select ? "add" : "remove"}-song`),
      { playlistId: playlist.id, track: track },
      'POST'
    ).then(() => setSelected(select));
  };

  return (
    <ListItem>
      <ToggleButton
        onClick={toggleItem}
        key={playlist.id}
        value="check"
        selected={selected}
        style={{ width: "100%" }}
      >
        <ListItemAvatar>
          <Avatar>{playlist.name.charAt(0).toUpperCase()}</Avatar>
        </ListItemAvatar>
        <ListItemText primary={playlist.name} />
      </ToggleButton>
    </ListItem>
  );
}

function SimpleDialog(props) {
  const { onClose, selectedValue, open, track } = props;

  const history = useHistory();
  const [playlists, setPlaylists] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (open) {
      setLoading(true);
      fetch(createUrl(`playlist/current-user`), { trackId: track.uri || track.id }, 'POST')
        .then((res) => {
          setLoading(false);
          setPlaylists(res.playlists);
        })
        .catch((e) => setError(e));
    }
  }, [open, track.id, track.uri]);

  const handleClose = () => {
    onClose(selectedValue);
    const path = new URL(window.location).pathname;
    if (path.includes('/playlist')) {
      history.push('/');
      setTimeout(() => {
        history.push(path);
      });
    }
  };

  if (loading || error) return <Loader />;

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Add to playlist</DialogTitle>
      <List sx={{ pt: 0 }}>
        {playlists.map((playlist, i) => (
          <ToggleBtn playlist={playlist} track={track} key={i} />
        ))}
      </List>
    </Dialog>
  );
}

export default function AddToPlaylistDialog({ track }) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        track={track}
      />
      <IconButton onClick={handleClickOpen}>
        <AddIcon />
      </IconButton>
    </div>
  );
}
