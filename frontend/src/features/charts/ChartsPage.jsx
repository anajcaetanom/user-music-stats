import {useState} from "react";
import {useUi} from "../../shared/context/UiContext";
import {BackToCategoriesButton} from "./components/BackToCategoriesButton";
import {SpotifyCharts} from "./components/SpotifyCharts";
import {LastFmCharts} from "./components/LastFmCharts";
import {SpotifyForm} from "./components/SpotifyForm";
import {LastFmForm} from "./components/LastFMForm";
import {ChooseSource} from "./components/ChooseSource";
import {HomeButton} from "./components/HomeButton";


const SOURCES = {
  SPOTIFY: "spotify",
  LASTFM: "lastfm",
};

const BaseLayout = ({ children, setCharts, setSource}) => (
  <>
    {children}
    <div className="spacer" />
    <HomeButton
      setCharts={setCharts}
      setSource={setSource}
    />
  </>
);

const ChartsPage = () => {
  const {
    setShowResults,
    showResults,
    isLoading,
  } = useUi();

  const [requestId] = useState("");
  const [source, setSource] = useState("");
  const [charts, setCharts] = useState([]);

  function renderSourceChart() {
    switch (source) {
      case SOURCES.SPOTIFY:
        return <SpotifyCharts
          charts={charts}
          requestId={requestId}
        />
      case SOURCES.LASTFM:
        return <LastFmCharts
          charts={charts}
        />
      default:
        return <p>Source error.</p>
    }
  }

  function renderSourceForm() {
    switch (source) {
      case SOURCES.SPOTIFY:
        return (
          <SpotifyForm
            requestId={requestId}
            setCharts={setCharts}
          />
        )
      case SOURCES.LASTFM:
        return <LastFmForm setCharts={setCharts} />
      default:
        return <p>Source error.</p>
    }
  }

  if (isLoading) {
    return (
      <BaseLayout setCharts={setCharts} setSource={setSource}>
        <p>Loading...</p>
      </BaseLayout>
    );
  }

  if (!showResults) {
    return (
      !source ? (
        <ChooseSource
          setSource={setSource}
        />
      ) : (
        <BaseLayout setCharts={setCharts} setSource={setSource}>
          {renderSourceForm(source)}
        </BaseLayout>
      )
    )
  }

  return (
    <BaseLayout setCharts={setCharts} setSource={setSource}>
      {renderSourceChart()}
      <div className="spacer" />
      <BackToCategoriesButton
        setShowResults={setShowResults}
        setCharts={setCharts}
      />
    </BaseLayout>
  )
};

export default ChartsPage;