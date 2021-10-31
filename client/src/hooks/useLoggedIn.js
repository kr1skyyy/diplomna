import { useState, useEffect } from "react"
import { createUrl, fetch } from '../util/utils';

export default function useLoggedIn(setIsLoading) {
  const auth = window.localStorage.getItem('auth');
  const [token] = useState(JSON.parse(auth).token);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(createUrl('session-alive'), { token: token }, 'POST')
      .then(res => {
        setSuccess(res.authenticated);
      })
      .catch(() => setSuccess(false))
      .finally(() => {
        setIsLoading(false);
      });
  }, [setIsLoading, token]);

  return success;
}
