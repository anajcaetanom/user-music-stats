import { useEffect, useState } from 'react';
import './App.css';
import "98.css";

import { BackToCategoriesButton } from '@components/BackToCategoriesButton';
import { HomeButton, DesktopButton } from '@components/Buttons';
import { SpotifyCharts } from '@components/SpotifyCharts';
import { LastFmCharts } from '@components/LastFmCharts';
import { SpotifyForm } from '@components/SpotifyForm'
import { LastFmForm } from '@components/LastFMForm';
import { ChooseSource } from '@components/ChooseSource';
import { TitleBar } from '@components/TitleBar';

import { useUi } from '@context/UiContext';


// teste
// import jsonData from './jucaetanom.json'
//

const AppBody = ({ source, setSource, requestId }) => {
  const {
    setShowResults,
    showResults,
    isLoading,
  } = useUi();

  const [charts, setCharts] = useState([]);

  function renderSourceChart(source) {
    switch (source) {
      case "spotify":
        return <SpotifyCharts
          charts={charts}
          requestId={requestId}
        />
      case "lastfm":
        return <LastFmCharts 
          charts={charts}
        />
      default:
        return <p>Source error.</p>
    }
  }

  function renderSourceForm(source) {
    switch (source) {
      case "spotify":
        return (
          <SpotifyForm 
            requestId={requestId} 
            setCharts={setCharts} 
          />
        )
      case "lastfm":
        return <LastFmForm setCharts={setCharts} />
      default:
        return <p>Source error.</p>
    }
  };

  const BaseLayout = ({ children }) => (
    <>
      {children}
      <div className="spacer" />
      <HomeButton 
        setCharts={setCharts}
        setSource={setSource}
      />
    </>
  );

  if (isLoading) {
    return (
      <BaseLayout>
        <p>Loading...</p>
      </BaseLayout>
    )
  };

  if (!showResults) {
    return (
      !source ? (
        <ChooseSource
          setSource={setSource}
        />
      ) : (
        <BaseLayout>
          {renderSourceForm(source)}
        </BaseLayout>
      )
    )
  };

  return (
    <BaseLayout>
        {renderSourceChart(source)}
      <div className="spacer" />
      <BackToCategoriesButton
        setShowResults={setShowResults}
        setCharts={setCharts}
      />
    </BaseLayout>
  )
};

const App = () => {
  const [requestId, setRequestId] = useState("");
  const [source, setSource] = useState("");
  const { isAppOpen, isClosing } = useUi();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const spotifyAuth = params.get('spotifyAuth');

    if (spotifyAuth === 'success') {
      const requestId = params.get('id');
      if (!requestId) {
        throw new Error("Id is missing.");
      } else {
        setRequestId(requestId);
        setSource("spotify");
        window.history.replaceState({}, document.title, "/");
      }
    } 
  }, [setSource]);

  return (
    <div className="background">
      {!isAppOpen ? (
        <DesktopButton />
      ) : ( 
        <div className={`window ${isClosing ? 'closing' : ''}`}>
        <TitleBar />
        <div className="window-body">
          <AppBody 
            requestId={requestId}
            setSource={setSource}
            source={source}
          />
        </div>
      </div>
      )}
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
