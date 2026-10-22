/////////// LastFm stuff ///////////

import { useData } from '../../../shared/context/DataContext';
import { useUi } from '../../../shared/context/UiContext';
import { fetchCategory } from '../services/lastFmService';
import { useState } from 'react';

export const LastFmForm = ({ setCharts }) => {
  const { username, setUsername,
          timespan, setTimespan,
          category, setCategory, setProfilePic } = useData();
  const { setShowResults, setIsLoading } = useUi();
  const [errorMessage, setErrorMessage] = useState('');

  const changeUsername = (event) => {
    const writtenUsername = event.target.value;
    setUsername(writtenUsername);
  };
  const changeTimespan = (event) => {
    const selectedTimespan = event.target.id;
    setTimespan(selectedTimespan);
  };
  const changeCategory = (event) => {
    const selectedCategory = event.target.id;
    setCategory(selectedCategory);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await fetchCategory(username, category, timespan);
      if (data) {
        setCharts(data);
        setShowResults(true);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="lastfm_form">
        <div className="center">
          <img
            src="/user-icon.jpg"
            alt="user icon"
            style={{ width: '11vh', borderRadius: '8px', border: '1px solid gray', margin: '2vh' }}
          />
        </div>
        <div className="field-row-stacked">
          <label htmlFor="lastfm_username">LastFM User:</label>
          <input
            id="lastfm_username"
            type="text"
            value={username}
            onChange={changeUsername}
            required
          />
        </div>
        <div className="spacer" style={{ marginBottom: '1vh' }}></div>
        <fieldset>
          <legend>Timespan</legend>
          <div className="field-row">
            <input
              id="7day"
              type="radio"
              name="timespan"
              onChange={changeTimespan}
              checked={timespan === '7day'}
              required
            />
            <label htmlFor="7day">Last week</label>
          </div>
          <div className="field-row">
            <input
              id="1month"
              type="radio"
              name="timespan"
              onChange={changeTimespan}
              checked={timespan === '1month'}
            />
            <label htmlFor="1month">Last month</label>
          </div>
          <div className="field-row">
            <input
              id="6month"
              type="radio"
              name="timespan"
              onChange={changeTimespan}
              checked={timespan === '6month'}
            />
            <label htmlFor="6month">6 months</label>
          </div>
          <div className="field-row">
            <input
              id="12month"
              type="radio"
              name="timespan"
              onChange={changeTimespan}
              checked={timespan === '12month'}
            />
            <label htmlFor="12month">Last year</label>
          </div>
        </fieldset>

        <div className="spacer"></div>
        <fieldset>
          <legend>Category</legend>
          <div className="field-row">
            <input
              id="tracks"
              type="radio"
              name="category"
              onChange={changeCategory}
              checked={category === 'tracks'}
            />
            <label htmlFor="tracks">Top Tracks</label>
          </div>
          <div className="field-row">
            <input
              id="artists"
              type="radio"
              name="category"
              onChange={changeCategory}
              checked={category === 'artists'}
              required
            />
            <label htmlFor="artists">Top Artists</label>
          </div>
          <div className="field-row">
            <input
              id="albums"
              type="radio"
              name="category"
              onChange={changeCategory}
              checked={category === 'albums'}
            />
            <label htmlFor="albums">Top Albums</label>
          </div>
        </fieldset>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '8px',
          marginBottom: '1vh',
        }}
      >
        <button type="submit" aria-label="submit" disabled={!username || !timespan || !category}>
          Generate Chart
        </button>
      </div>
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </form>
  );
};
