/////////// Spotify stuff ///////////
import { useData } from "../context/DataContext";
import { useUi } from "../context/UiContext";
import axios from "axios";

export const SpotifyForm = ({ requestId, setCharts }) => {
  const { timespan, setTimespan,
          category, setCategory, } = useData();
  const { setShowResults, setIsLoading} = useUi();

  const changeTimespan = (event) => {
    const selectedTimespan = event.target.id;
    setTimespan(selectedTimespan);
  }
  const changeCategory = (event) => {
    const selectedCategory = event.target.id;
    setCategory(selectedCategory);
  }

  const SpotifyHandleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      const baseURL = process.env.REACT_APP_PROXY_SPOTIFY_URL;
      let url = `${baseURL}/top/${category}`;

      const res = await axios.get(url, {
        params: {
          time_range: timespan,
          limit: 10,
          id: requestId
        }
      });

      setCharts(res.data);
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

  return (
    <form onSubmit={SpotifyHandleSubmit}>
      
      <fieldset>
        <legend>Timespan</legend>
        <div className="field-row">
          <input id="short_term" type="radio" name="timespan" onChange={changeTimespan} checked={timespan === "short_term"} />
          <label htmlFor="short_term">Last month</label>
        </div>
        <div className="field-row">
          <input id="medium_term" type="radio" name="timespan" onChange={changeTimespan} checked={timespan === "medium_term"} />
          <label htmlFor="medium_term">6 months</label>
        </div>
        <div className="field-row">
          <input id="long_term" type="radio" name="timespan" onChange={changeTimespan} checked={timespan === "long_term"} />
          <label htmlFor="long_term">Last year</label>
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
      </fieldset>

      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '8px' }}>
        <button type="submit" aria-label="submit" disabled={ !timespan || !category }>
          Generate Chart
        </button>
      </div>

    </form>
  )
};

