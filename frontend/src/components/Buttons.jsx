import axios from "axios";
import { useData } from "@context/DataContext";
import { useUi } from "@context/UiContext";

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


export const DesktopButton = ({}) => {
	const { setIsAppOpen } = useUi();

	async function openApp() {
		setIsAppOpen(true);
	}

	return (
		<div className="desktop-icon" onClick={openApp} style={{ cursor: 'pointer', textAlign: 'center', width: '80px' }}>
      <div className="icon"><img src="/desktop-icon.png" alt="Icon" style={{ width: '64px', height: '64px', display: 'block', margin: '0 auto' }} /></div>
      <span style={{ 
        display: 'block', 
        marginTop: '4px', 
        marginLeft: '8px', 
        fontSize: '14px', 
        color: '#660033' 
        }}><strong>✧User Stats✧</strong></span>
    </div>
	)
}