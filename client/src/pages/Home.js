import React from "react";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { getUser } from "../util/utils";
import { spotifyApi } from "../Dashboard";

export default function Home() {
  const user = getUser();

  const playSong = () => {
    
    spotifyApi
    .searchTracks('never gonna give you up')
    .then((data) => {
      const song = data.body.tracks.items[0];
      document.dispatchEvent(new CustomEvent('play-track', { detail: { song } }));
    });
  };

  return (
    <div className="mt-4">
      <Container className="pt-4" maxWidth="md">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Welcome, {user.firstName} {user.lastName}
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          DiplomnaMusicApp is a music streaming platform using the Spotify API. It provides an interesting set of features including searching for songs, creating playlists, top charts and so much more.
        </Typography>
        <div className="pt-3">
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button variant="contained" color="primary" onClick={playSong}>
                Play me a song
              </Button>
            </Grid>
            <Grid item>
              <Link to="/Songs">
                <Button variant="outlined" color="primary">
                  Check music genres
                </Button>
              </Link>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
}
