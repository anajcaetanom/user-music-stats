import React from "react";
import './App.css';
import "98.css";
import axios from "axios";

// teste
import jsonData from './jucaetanom.json'
//

const TitleBar = ({ showResults, setShowResults }) => {
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

const Form = ({
  onSubmit,
  username,
  setUsername,
  timespan,
  setTimespan,
  category,
  setCategory,
}) => {

  const changeUsername = (event) => {
    const writtenUsername = event.target.value;
    setUsername(writtenUsername);
  }
  const changeTimespan = (event) => {
    const selectedTimespan = event.target.id;
    setTimespan(selectedTimespan);
  }
  const changeCategory = (event) => {
    const selectedCategory = event.target.id;
    setCategory(selectedCategory);
  }

  return (
    <form onSubmit={onSubmit}>
      <div style={{ paddingBottom: '8px' }} className="field-row">
        <label htmlFor="lastfm_username">LastFM User</label>
        <input id="lastfm_username" type="text" value={username} onChange={changeUsername} required />
      </div>

      <fieldset>
        <legend>Timespan</legend>
        <div className="field-row">
          <input id="7days" type="radio" name="timespan" onChange={changeTimespan} checked={timespan === "7day"} />
          <label htmlFor="7days">Last week</label>
        </div>
        <div className="field-row">
          <input id="1month" type="radio" name="timespan" onChange={changeTimespan} checked={timespan === "1month"} required />
          <label htmlFor="1month">Last month</label>
        </div>
        <div className="field-row">
          <input id="6months" type="radio" name="timespan" onChange={changeTimespan} checked={timespan === "6month"} />
          <label htmlFor="6months">6 months</label>
        </div>
        <div className="field-row">
          <input id="12months" type="radio" name="timespan" onChange={changeTimespan} checked={timespan === "12month"} />
          <label htmlFor="12months">Last year</label>
        </div>
      </fieldset>
      <div style={{ height: '8px'}} className="spacer"></div>
      <fieldset>
        <legend>Category</legend>
        <div className="field-row">
          <input id="tracks" type="radio" name="category" onChange={changeCategory} checked={category === "tracks"} />
          <label htmlFor="tracks">Top Tracks</label>
        </div>
        <div className="field-row">
          <input id="artists" type="radio" name="category" onChange={changeCategory} checked={category === "artists"} required />
          <label htmlFor="artists">Top Artists</label>
        </div>
        <div className="field-row">
          <input id="albums" type="radio" name="category" onChange={changeCategory} checked={category === "albums"} />
          <label htmlFor="albums">Top Albums</label>
        </div>
      </fieldset>

      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '8px' }}>
        <button type="submit" aria-label="submit" disabled={ !username || !timespan || !category }>
          Generate Chart
        </button>
      </div>
    </form>
  )
}

const Charts = ({ charts }) => {
  return (
    <div> 
      {charts && charts.length > 0 ? (
        <div> 
          {charts.map((chart) => (
            <ul key={chart.mbid} class="tree-view">
              <li><strong>{chart.name}</strong></li>
              <li>Playcount: {chart.playcount}</li>
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

const App = () => {
  const [showResults, setShowResults] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [timespan, setTimespan] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [charts, setCharts] = React.useState([]);

  /*
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      let url = '';

      const baseUrl = 'http://localhost:4000';

      switch (category) {
        case 'artists':
          url = `${baseUrl}/top-artists/${username}`;
          break;
        case 'albums':
          url = `${baseUrl}/top-albums/${username}`;
          break;
        case 'tracks':
          url = `${baseUrl}/top-tracks/${username}`;
          break;
      }

      axios.get(url, {
        params: {
          period: timespan,
          limit: 10
        }
      })
      .then(res => {
        console.log(res.data);
        setCharts(res.data);
      })
      .catch(err => {
        console.error(err)
      })

      setShowResults(true);

    } catch (error) {
      if (error.response) {
        console.error('Resposta do servidor com erro:', error.response.data);
        console.error('Código do erro:', error.response.status);
      } else if (error.request) {
        console.error('A requisição foi feita, mas não houve resposta', error.request);
      } else {
        console.error('Erro ao configurar a requisição', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  */

  // teste
  const submitTest = async (event) => {
    event.preventDefault(); 
    setIsLoading(true);
    try {
      const data = jsonData.artist
      setCharts(data)
      setShowResults(true);
    } catch (error) {
      console.error('Erro ao carregar o arquivo JSON:', error);
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <div className="background">
      <div className="window">
        <TitleBar 
          showResults={showResults}
          setShowResults={setShowResults}
        />
        <div className="window-body">
          {isLoading ? (
            <p>Loading...</p>
          ) : !showResults ? (
            <Form 
              onSubmit={submitTest}
              username={username}
              setUsername={setUsername}
              timespan={timespan}
              setTimespan={setTimespan}
              category={category}
              setCategory={setCategory}
            />
          ) : (
            <Charts charts={charts} />
          )}
        </div>
      </div>
    </div>
  )};



export default App;
