import {useUi} from "../../../shared/context/UiContext";
import {useData} from "../../../shared/context/DataContext";
import {fetchCategory, fetchUserName} from "../services/spotifyService";
import {useEffect, useState} from "react";


export const SpotifyForm = ({ requestId, setCharts }) => {
  const { setShowResults, isLoading, setIsLoading} = useUi();
  const { 
    timespan, setTimespan,
    category, setCategory, 
    username, setUsername, 
  } = useData();

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserName(requestId)
      .then(setUsername)
      .catch(setError)
  }, [requestId]);

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

    if (isLoading) return;

    setIsLoading(true);
    
    try {

      const data = await fetchCategory(requestId, category, timespan);

      if (data) {
        setCharts(data);
        setShowResults(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={SpotifyHandleSubmit}>
      <div className="center">
        <p><strong> user: {username?.toUpperCase()}</strong></p>
      </div>
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

      <div className="spacer"></div>

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
        <button type="submit" aria-label="submit" disabled={ !timespan || !category || isLoading }>
          Generate Chart
        </button>
      </div>

    </form>
  )
};

