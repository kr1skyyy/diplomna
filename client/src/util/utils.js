export const BACKEND_URL = 'http://localhost:4000';

export const createUrl = (path = '') => {
    return `${BACKEND_URL}/${path}`;
};

export const createSpotifyApiUrl = (path) => {
    return `${BACKEND_URL}/spotifyapi/${path}`;
};

export const fetch = (url, obj = '{}', method = 'GET') => {
    if (method === 'GET') return window.fetch(url).then(res => res.json);
    return window.fetch(url, { method, body: JSON.stringify(obj), headers: { 'Content-Type': 'application/json'}})
        .then(res => res.json());
};

export const saveAuth = (obj) => {
    window.localStorage.setItem('auth', JSON.stringify(obj));
};
