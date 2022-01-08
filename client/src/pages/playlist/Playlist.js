import * as React from 'react';

import { createUrl, fetch, showMsg } from "../../util/utils";

import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Playlist({ playlist }) {
  const { name, id, created } = playlist;

  const deleteSong = () => {
    const response = fetch(createUrl(`playlist/delete?id=${id}`));
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
      />
      {/* <CardMedia
        component="img"
        height="194"
        image="/static/images/cards/paella.jpg"
        alt="Paella dish"
      /> */}
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={deleteSong}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
