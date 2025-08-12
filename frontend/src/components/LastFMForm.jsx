/////////// LastFm stuff ///////////
import { useData } from "@context/DataContext";
import { useUi } from "@context/UiContext";
import axios from "axios";

export const LastFmForm = ({setCharts}) => {
  const {
    username,
    setUsername,
    timespan,
    setTimespan,
    category,
    setCategory,
    setProfilePic
  } = useData();
  const { setShowResults, setIsLoading} = useUi();

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

  const getProfilePic = async (event) => {
    event.preventDefault();
    
    try {
      const baseUrl = import.meta.env.VITE_PROXY_LASTFM_URL;
      const url = `${baseUrl}/profile-pic/${username}`;

      const res = await axios.get(url);

      setProfilePic(res.data.imageUrl);

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

  const LastFmHandleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const baseURL = import.meta.env.VITE_PROXY_LASTFM_URL;
      let url = '';

      switch (category) {
        case 'artists':
          url = `${baseURL}/top-artists/${username}`;
          break;
        case 'albums':
          url = `${baseURL}/top-albums/${username}`;
          break;
        case 'tracks':
          url = `${baseURL}/top-tracks/${username}`;
          break;
        default:
          throw new Error('Categoria inválida');
      }

      const res = await axios.get(url, {
        params: {
          period: timespan,
          limit: 10
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
      //await getProfilePic({ preventDefault: () => {} });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={LastFmHandleSubmit}>

      <div className="lastfm_form">
        <div className="center">
          <img 
            src="/user-icon.jpg" 
            alt="user icon" 
            style={{ width: '11vh', borderRadius: '8px', border: '1px solid gray', margin: '2vh'}}
          />
        </div>
        <div className="field-row-stacked">
          <label htmlFor="lastfm_username">LastFM User:</label>
          <input id="lastfm_username" type="text" value={username} onChange={changeUsername} required />
        </div>
        <div className="spacer" style={{marginBottom: "1vh"}}></div>
        <fieldset>
          <legend>Timespan</legend>
          <div className="field-row">
            <input id="7day" type="radio" name="timespan" onChange={changeTimespan} checked={timespan === "7day"} required />
            <label htmlFor="7day">Last week</label>
          </div>
          <div className="field-row">
            <input id="1month" type="radio" name="timespan" onChange={changeTimespan} checked={timespan === "1month"} />
            <label htmlFor="1month">Last month</label>
          </div>
          <div className="field-row">
            <input id="6month" type="radio" name="timespan" onChange={changeTimespan} checked={timespan === "6month"} />
            <label htmlFor="6month">6 months</label>
          </div>
          <div className="field-row">
            <input id="12month" type="radio" name="timespan" onChange={changeTimespan} checked={timespan === "12month"} />
            <label htmlFor="12month">Last year</label>
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
          <div className="field-row">
            <input id="albums" type="radio" name="category" onChange={changeCategory} checked={category === "albums"} />
            <label htmlFor="albums">Top Albums</label>
          </div>
        </fieldset>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '8px', marginBottom: '1vh' }}>
        <button type="submit" aria-label="submit" disabled={ !username || !timespan || !category }>
          Generate Chart
        </button>
      </div>

    </form>
  )
};


