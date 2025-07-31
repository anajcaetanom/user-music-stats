export const ChooseSource = ({setSource}) => {
    
  const handleSpotifyClick = () => {
    const baseURL = process.env.REACT_APP_PROXY_SPOTIFY_URL;
    const url = `${baseURL}/auth`;

    try {
      window.location.href = url;
    } catch (error) {
      console.log(error);
    } 
  };

  return (
    <div className="center">
      <button onClick={handleSpotifyClick}>
        Spotify
      </button>
      <button onClick={() => setSource("lastfm")}>
        LastFM
      </button>
    </div>
  ) 
};