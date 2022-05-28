import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { createUrl, fetch, saveAuth } from '../util/utils';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

const Fields = ({ isSignIn, setIsSignIn, isLogged, setIsLogged }) => {
    const [error, setError] = React.useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const user = {
            email: data.get('email'),
            password: data.get('password'),
        };

        if (!isSignIn) {
            user.firstName = data.get('firstName');
            user.lastName = data.get('lastName');
        }

        const URL = createUrl(isSignIn ? 'login' : 'register');

        fetch(URL, user, 'POST')
          .then((data) => {
            if (!data.error && data.success) {
              saveAuth(data);
              return setIsLogged(true);
            }

            setIsLogged(false);
            setError(data.message);
          })
          .catch(() => {
            setIsLogged(false);
          });
    };
    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          { error && <h3 className="my-3 text-center" style={{ color: 'red'}}>Error: {error}</h3>}
          {isSignIn
          ? <>
              <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus />
              <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" /> 
            </>
          : <>
              <TextField margin="normal" required fullWidth id="firstName" label="First Name" name="firstName" autoFocus />
              <TextField margin="normal" required fullWidth name="lastName" label="Last Name" type="lastName" id="lastName" /> 
              <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" />
              <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" /> 
            </>
          }

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                {isSignIn ? "Sign In" : "Sign Up" }
            </Button>
            
            <Grid container>
                <Grid item>
                  <Link style={{cursor: 'pointer'}} onClick={() => setIsSignIn(!isSignIn)} variant="body2">
                    {isSignIn ? `Don't have an account? Sign Up` : 'Take me back to Sign In.'}
                  </Link>
                </Grid>
            </Grid>
        </Box>
    );
}

export default function SignIn({isLogged, setIsLogged}) {
  const [isSignIn, setIsSignIn] = React.useState(true);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Fields isSignIn={isSignIn} setIsSignIn={setIsSignIn} isLogged={isLogged} setIsLogged={setIsLogged} />
        </Box>
      </Container>
    </ThemeProvider>
  );
}