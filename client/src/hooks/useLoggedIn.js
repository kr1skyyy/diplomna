import { useState, useEffect } from "react"
import { createUrl, fetch, getToken } from '../util/utils';

export default function useLoggedIn(setIsLoading) {
  const token = getToken()
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
