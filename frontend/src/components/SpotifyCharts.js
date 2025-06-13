import axios from "axios";
import { useData } from "../context/DataContext";
import { useEffect } from "react";

export const SpotifyCharts = ({charts, requestId}) => {
  const { username, setUsername, timespan, category} = useData();
  const data = charts.items;

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const baseURL = process.env.REACT_APP_PROXY_SPOTIFY_URL;
        let url = `${baseURL}/userName`;
        const res = await axios.get(url, {
          params: {
            id: requestId
          }
        });
        setUsername(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserName();
  }, [requestId]);
  
  // console.log(data);

  const categoryMap = {
    tracks: "Tracks",
    artists: "Artists",
  };

  const timespanMap = {
    short_term: "last month",
    medium_term: "last 6 months",
    long_term: "last year",
  };

  return (
    <div>
      <div className="center">
        <p><strong> {username.toUpperCase()}'s Top {categoryMap[category]} in the {timespanMap[timespan]}. </strong></p>
      </div>
      <div className="spacer" style={{ height: '8px' }} />
      {data && data.length > 0 ? (
        <div> 
          {data.map((chart, index) => (
            <ul key={chart.id || `${chart.name}-${index}`} className="tree-view">
              <li><strong>{index + 1}. {chart.name}</strong></li>
              {category === "tracks" && (
                <li>{chart.artists[0].name}</li>
              )}
            </ul>
          ))}
        </div>
      ) : (
        <div>
          <p>No charts available</p>
        </div>
      )}
    </div>
  )

}