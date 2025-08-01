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
    <div>
      <div 
        className="divider"
        style={{alignItems: 'top', marginBottom: '2vh', marginTop: '0px'}}
      >
        <span>✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦</span>
      </div>
      <h4><strong>Welcome to WinCharts App!</strong></h4>
      <div className="text">
        <p>Discover your top artists, tracks, and albums over any time period, all in a nostalgic Windows 98 style.</p>
        <p>Choose your data source to get started:</p>
      </div>
      <div className="center">
        <button onClick={handleSpotifyClick}>
          Spotify
        </button>
        <button onClick={() => setSource("lastfm")}>
          LastFM
        </button>
      </div>
      <div className="divider">
        <span>✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦ . ⁺ . ✦</span>
      </div>
    </div>
  ) 
};