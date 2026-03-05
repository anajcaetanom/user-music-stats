import {useData} from "../../../shared/context/DataContext";
import {fetchUserName} from "../services/spotifyService";


export const SpotifyCharts = ({charts, requestId}) => {
  const { username, setUsername, timespan, category} = useData();
  const data = charts.items;

  setUsername(fetchUserName(requestId));



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
      <div className="spacer"/>
      <div className="charts">
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
    </div>
  )

}