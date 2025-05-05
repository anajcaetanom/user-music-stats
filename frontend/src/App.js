import React from "react";
import './App.css';
import "98.css";
import axios from "axios";

const App = () => {

  const [username, setUsername] = React.useState("");
  const [timespan, setTimespan] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [charts, setCharts] = React.useState([]);

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

  const generateChart = async (event) => {
    event.preventDefault();

    try {
        const response = await axios.get('http://localhost:5000/generate_chart', {
            params: {
                username: username,
                timespan: timespan,
                category: category
            }
        });
    }

    console.log(username, timespan, category);
  }


  return (
    <div className="background">
      <div className="window">
        <div className="title-bar">
          <div className="title-bar-text">LastFM Stats</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize" />
            <button aria-label="Maximize" />
            <button aria-label="Close" />
          </div>
        </div>

        <div className="window-body">

          <form onSubmit={generateChart}>
            <div style={{ paddingBottom: '8px' }} className="field-row">
              <label htmlFor="lastfm_username">LastFM User</label>
              <input id="lastfm_username" type="text" onChange={changeUsername} required />
            </div>

            <fieldset>
              <legend>Timespan</legend>
              <div className="field-row">
                <input id="7days" type="radio" name="timespan" onChange={changeTimespan} />
                <label htmlFor="7days">Last week</label>
              </div>
              <div className="field-row">
                <input id="1month" type="radio" name="timespan" onChange={changeTimespan} required />
                <label htmlFor="1month">Last month</label>
              </div>
              <div className="field-row">
                <input id="6months" type="radio" name="timespan" onChange={changeTimespan} />
                <label htmlFor="6months">6 months</label>
              </div>
              <div className="field-row">
                <input id="12months" type="radio" name="timespan" onChange={changeTimespan} />
                <label htmlFor="12months">Last year</label>
              </div>
            </fieldset>
            <div style={{ height: '8px'}} class="spacer"></div>
            <fieldset>
              <legend>Category</legend>
              <div className="field-row">
                <input id="tracks" type="radio" name="category" onChange={changeCategory} />
                <label htmlFor="tracks">Top Tracks</label>
              </div>
              <div className="field-row">
                <input id="artists" type="radio" name="category" onChange={changeCategory} required />
                <label htmlFor="artists">Top Artists</label>
              </div>
              <div className="field-row">
                <input id="albums" type="radio" name="category" onChange={changeCategory} />
                <label htmlFor="albums">Top Albums</label>
              </div>
            </fieldset>

            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '8px' }}>
              <button type="submit">
                Generate Chart
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
    
  );
};

export default App;
