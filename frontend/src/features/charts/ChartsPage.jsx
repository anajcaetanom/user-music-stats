import { useState } from 'react';
import { useUi } from '../../shared/context/UiContext';
import { BackToCategoriesButton } from './components/BackToCategoriesButton';
import { SpotifyCharts } from './components/SpotifyCharts';
import { LastFmCharts } from './components/LastFmCharts';
import { SpotifyForm } from './components/SpotifyForm';
import { LastFmForm } from './components/LastFMForm';
import { ChooseSource } from './components/ChooseSource';
import { HomeButton } from './components/HomeButton';
import { useResetValues } from './hooks/useResetValues';

const SOURCES = {
  SPOTIFY: 'spotify',
  LASTFM: 'lastfm',
};

const BaseLayout = ({ children, resetValues }) => (
  <>
    {children}
    <div className="spacer" />
    <HomeButton resetValues={resetValues} />
  </>
);

const ChartsPage = () => {
  const { isLoading } = useUi();

  const [showResults, setShowResults] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [source, setSource] = useState('');
  const [charts, setCharts] = useState([]);

  const step = isLoading ? 'loading' : !source ? 'choose' : !showResults ? 'form' : 'results';

  function renderSourceForm() {
    switch (source) {
      case SOURCES.SPOTIFY:
        return <SpotifyForm requestId={requestId} setCharts={setCharts} />;
      case SOURCES.LASTFM:
        return <LastFmForm setCharts={setCharts} />;
      default:
        return <p>Source error.</p>;
    }
  }

  function renderSourceChart() {
    switch (source) {
      case SOURCES.SPOTIFY:
        return <SpotifyCharts charts={charts} requestId={requestId} />;
      case SOURCES.LASTFM:
        return <LastFmCharts charts={charts} />;
      default:
        return <p>Source error.</p>;
    }
  }

  const resetValues = useResetValues(setCharts, setSource);

  switch (step) {
    case 'loading':
      return (
        <BaseLayout resetValues={resetValues}>
          <p>Loading...</p>
        </BaseLayout>
      );
    case 'choose':
      return <ChooseSource setSource={setSource} />;
    case 'form':
      return <BaseLayout resetValues={resetValues}>{renderSourceForm(source)}</BaseLayout>;
    case 'results':
      return (
        <BaseLayout resetValues={resetValues}>
          {renderSourceChart()}
          <div className="spacer" />
          <BackToCategoriesButton setShowResults={setShowResults} setCharts={setCharts} />
        </BaseLayout>
      );
  }
};

export default ChartsPage;
