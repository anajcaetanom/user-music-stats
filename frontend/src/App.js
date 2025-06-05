import { useEffect } from 'react';
import './App.css';
import "98.css";
import axios from "axios";

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
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    const url = `${baseUrl}/spotify/auth`;

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

  const resetValues = () => {
    setShowResults(false);
    setIsLoading(false);
    setUsername('');
    setTimespan('');
    setCategory('');
    setCharts([]);
    setSource('');
  };

  return (
    <div className='center'>
      <button onClick={resetValues}>
        Return to Home
      </button>
    </div>
  );
};

const Logout = () => {
  const baseUrl = process.env.REACT_APP_BACKEND_URL;
  const url = `${baseUrl}/spotify/logout`
  axios.get(url)
}

const App = () => {
  const {
    showResults,
    isLoading,
    source,
    setSource,
  } = useAppContext();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const spotifyAuth = params.get('spotifyAuth');

    if (spotifyAuth === 'success') {
      setSource("spotify");
      window.history.replaceState({}, document.title, "/");
    }
  }, [setSource]);

  function renderSourceForm(source) {
    switch (source) {
      case "spotify":
        return <SpotifyForm />
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
            <div>
              <Charts />
              <HomeButton />
              <Logout />
            </div>
          )}
        </div>
      </div>
    </div>
  )};


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
