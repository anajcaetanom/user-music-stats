import { useEffect } from 'react';

function handleSpotifyAuth(setRequestId, setSource) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const spotifyAuth = params.get('spotifyAuth');

    if (spotifyAuth === 'success') {
      const requestId = params.get('id');
      if (!requestId) {
        throw new Error('ID is missing.');
      } else {
        setRequestId(requestId);
        setSource('spotify');
        window.history.replaceState({}, document.title, '/');
      }
    }
  }, [setRequestId, setSource]);
}
