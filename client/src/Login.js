import React from "react"
import BuildCircleIcon from '@mui/icons-material/BuildCircle';

const CLIENT_ID = '2736f0fba5bd47febe645ba84dc7fa05';
const REDIRECT_URI = 'http://localhost:4000';

const AUTH_URL =
  `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`

export default function Login() {
  return (
    <div className="container text-center">
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <BuildCircleIcon className="mb-5" style={{ fontSize: 150, color: '#28a745' }} /> 
        <div className="mb-5 pt-5">
          <h3>You need to provide access to your spotify account in order for the application to work.</h3>
        </div>
        <a className="btn btn-success btn-lg p-3" href={AUTH_URL}>
          Log in with Spotify
        </a>
      </div>
    </div>
  )
}
