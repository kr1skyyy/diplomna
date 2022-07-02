import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { createUrl, fetch, showMsg } from "../../util/utils";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export default function Playlist({ playlist, removePlaylist }) {
  const { name, id, created } = playlist;
  const history = useHistory();

  const openPlaylist = () => {
    history.push(`/playlist/${id}`);
  };

  const deletePlaylist = () => {
    fetch(createUrl(`playlist/delete/${id}`)).then(() => removePlaylist(id));
  };

  const copyPlaylistUrl = () => {
    navigator.clipboard.writeText(createUrl(`playlist/${id}`));
    showMsg({ success: true, message: 'The share playlist url was copied to your clipboard'});
  };

  const playPlaylist = (e) => {
    e.preventDefault();

    fetch(createUrl(`playlist/${id}`))
      .then(({ songs }) => {
        const playlist = songs.map((song) => (song.uri || song.id));
        document.dispatchEvent(new CustomEvent('set-player-songs', { detail: { playlist } }));
      });
  }

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="playlist">
            {name.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={name}
        subheader={new Date(created).toLocaleDateString()}
        onClick={openPlaylist}
      />
      <CardActions disableSpacing>
        <IconButton aria-label="play" onClick={playPlaylist}>
          <PlayArrowIcon />
        </IconButton>
        <IconButton aria-label="share" onClick={copyPlaylistUrl}>
          <ShareIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={deletePlaylist}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
