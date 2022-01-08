import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export const BACKEND_URL = "http://localhost:4000";

export const createUrl = (path = "") => {
  return `${BACKEND_URL}/${path}`;
};

export const createSpotifyApiUrl = (path) => {
  return `${BACKEND_URL}/spotifyapi/${path}`;
};

export const fetch = (url, obj = {}, method = "GET") => {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["x-access-token"] = token;

  const settings = { method, headers };
  if (method === "POST") settings.body = JSON.stringify(obj);

  return window.fetch(url, settings).then((res) => res.json()).finally(showMsg);
};

export const getToken = () => {
  const user = window.localStorage.getItem("auth");
  if (!user) return undefined;

  return JSON.parse(user).token;
};

export const saveAuth = (obj) => {
  window.localStorage.setItem("auth", JSON.stringify(obj));
};

export const showMsg = (resp) => {
  const msg = (
    <Stack style={{ position: 'fixed', top: 40, right: 25, zIndex: 999999999 }} spacing={2}>
      <Alert severity={resp?.success ? "success" : 'error'}>{resp?.message || 'Unknown Action, probably an error'}</Alert>
    </Stack>
  );

  document.dispatchEvent(new CustomEvent('show-message', { detail: { msg }}));
};
