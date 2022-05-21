import { useState, useEffect } from "react"
import { createSpotifyApiUrl, fetch } from '../util/utils';

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  useEffect(() => {
    fetch(createSpotifyApiUrl('login'), { code }, 'POST')
      .then(res => {
        setAccessToken(res.accessToken);
        setRefreshToken(res.refreshToken);
        setExpiresIn(res.expiresIn);
      })
      .catch(() => {
        window.location = "/"
      })
  }, [code])

  useEffect(() => {
    if (!refreshToken || !expiresIn) return
    const interval = setInterval(() => {
      fetch(createSpotifyApiUrl('refresh'), { refreshToken }, 'POST')
        .then(res => {
          setAccessToken(res.accessToken);
          setExpiresIn(res.expiresIn);
        })
        .catch(() => {
          window.location = "/"
        })
    }, (expiresIn - 60) * 1000)

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
