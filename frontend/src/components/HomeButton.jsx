import axios from "axios";
import { useData } from "../context/DataContext";
import { useUi } from "../context/UiContext";

export const HomeButton = ({setCharts, setSource}) => {
  const { setShowResults, setIsLoading } = useUi();
  const { setUsername, setTimespan, setCategory } = useData();

  async function resetValues () {
    setShowResults(false);
    setIsLoading(false);
    setUsername('');
    setTimespan('');
    setCategory('');
    setCharts([]);
    setSource('');

    const baseURL = process.env.REACT_APP_PROXY_SPOTIFY_URL;
    try {
      const res = await axios.get(`${baseURL}/cleanRedis`);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="center">
      <button onClick={resetValues}>Go Home</button>
    </div>
  );
};