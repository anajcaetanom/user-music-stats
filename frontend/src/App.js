import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import "98.css";

import { useAppContext } from "./context/AppContext";

import { LastFmForm } from './LastFM';
import { SpotifyForm } from './Spotify'

// teste
// import jsonData from './jucaetanom.json'
//

const TitleBar = () => {
  const {
    showResults, 
    setShowResults
  } = useAppContext();

  const backButton = () => {
    setShowResults(false)
  }

  return (
    <div className="title-bar">
      <div className="title-bar-text">LastFM Stats</div>
      <div className="title-bar-controls">
        <button 
          aria-label="Close" 
          disabled={!showResults} 
          onClick={backButton}
        />
      </div>
    </div>
  )
}

const ChooseSource = () => {
  const {
    setSource,
  } = useAppContext();

  const handleSpotifyClick = () => {
    const baseURL = process.env.REACT_APP_PROXY_SPOTIFY_URL;
    const url = `${baseURL}/auth`;

    try {
      window.location.href = url;
    } catch (error) {
      console.log(error);
    } 
  }

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
}

const Charts = () => {
  const {
    charts, 
    source
  } = useAppContext();

  const data = source === "spotify" ? charts.items : charts;

  return (
    <div> 
      {data && data.length > 0 ? (
        <div> 
          {data.map((chart, index) => (

            <ul key={chart.id || chart.mbid} className="tree-view">
              <li><strong>{index + 1}{chart.name}</strong></li>
              {source === "lastfm" && (
                <li>Playcount: {chart.playcount}</li> 
              )} 
            </ul>
          ))}
        </div>
      ) : (
        <div>
          <p>No charts available</p>
        </div>
      )}
      </div>
  );
};

const HomeButton = () => {
  const {
    setShowResults,
    setIsLoading,
    setUsername,
    setTimespan,
    setCategory,
    setCharts,
    setSource,
  } = useAppContext();

  async function resetValues () {
    setShowResults(false);
    setIsLoading(false);
    setUsername('');
    setTimespan('');
    setCategory('');
    setCharts([]);
    setSource('');

    const baseURL = process.env.REACT_APP_PROXY_SPOTIFY_URL;
    try {
      const res = await axios.get(`${baseURL}/cleanRedis`);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='center'>
      <button onClick={resetValues}>
        Return to Home
      </button>
    </div>
  );
};

const App = () => {
  const {
    showResults,
    isLoading,
    source,
    setSource,
  } = useAppContext();

  const [requestId, setRequestId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const spotifyAuth = params.get('spotifyAuth');

    if (spotifyAuth === 'success') {
      const requestId = params.get('id');
      if (!requestId) {
        throw new Error("Id is missing.");
      } else {
        setSource("spotify");
        setRequestId(requestId);
        window.history.replaceState({}, document.title, "/");
      }
    } 
  }, [setSource]);

  function renderSourceForm(source) {
    switch (source) {
      case "spotify":
        return <SpotifyForm requestId={requestId} />
      case "lastfm":
        return <LastFmForm />
      default:
        return <p>Source error.</p>
    }
  }

  return (
    <div className="background">
      <div className="window">
        <TitleBar />
        <div className="window-body">
          {isLoading ? (
            <div>
              <p>Loading...</p>
              <HomeButton />
            </div>
          ) : !showResults ? (
            !source ? (
              <div>
                <ChooseSource />
              </div>
            ) : (
              <div>
                {renderSourceForm(source)}
                <HomeButton />
              </div>
            )
          ) : (
            source === "spotify" ? (
              <div>
                <Charts />
                <div style={{ height: '8px'}} className="spacer"></div>
                <HomeButton />
              </div>
            ) : (
            <div>
              <Charts />
              <div style={{ height: '8px'}} className="spacer"></div>
              <HomeButton />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default App;

  /*
  const submitTest = async (event) => {
    event.preventDefault(); 
    setIsLoading(true);
    try {
      const data = jsonData
      setCharts(data)
      setShowResults(true);
    } catch (error) {
      console.error('Erro ao carregar o arquivo JSON:', error);
    } finally {
      setIsLoading(false);
    }
  };
  */
