import { createUrl, fetch } from '../util/utils';
import { useCallback, useEffect, useState } from "react"

export default function useFetch(endpoint, obj = {}, method = 'GET', dependencies = []) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [value, setValue] = useState()

  const callbackMemoized = useCallback(() => {
    setLoading(true);
    setError(undefined);
    setValue(undefined);
    fetch(createUrl(endpoint), obj, method)
      .then(setValue)
      .catch(setError)
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => {
    callbackMemoized();
  }, [callbackMemoized]);

  return { loading, error, value, setValue }
}