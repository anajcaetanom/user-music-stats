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
    <div style={{
      flexDirection: 'column',
      justifyContent: 'center'
    }}
    >
      <div>
        <h5>Welcome to WinCharts App!</h5>
        <p>Discover your top artists, tracks, and albums over any time period, all in a nostalgic Windows 98 style.</p>
        <p>Choose your data source to get started:</p>
      </div>
      <div className="center" style={{
        transform: 'translateX(-1px) translateY(2vh)'
      }}>
        <button onClick={handleSpotifyClick}>
          Spotify
        </button>
        <button onClick={() => setSource("lastfm")}>
          LastFM
        </button>
      </div>
    </div>
  ) 
};