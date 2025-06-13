import { useData } from "../context/DataContext";

export const LastFmCharts = ({charts}) => {
  const { username, timespan, category} = useData();
  // console.log(charts);

  const categoryMap = {
    tracks: "Tracks",
    artists: "Artists",
    albums: "Albums"
  };

  const timespanMap = {
    "7day": "last week",
    "1month": "last month",
    "6month": "last 6 months",
    "12month": "last year"
  };

  return (
    <div> 
      <div className="center">
        <p><strong> {username.toUpperCase()}'s Top {categoryMap[category]} in the {timespanMap[timespan]}. </strong></p>
      </div>
      <div className="spacer" style={{ height: '8px' }} />
      {charts && charts.length > 0 ? (
        <div> 
          {charts.map((chart, index) => (
            <ul key={chart.mbid || `${chart.name}-${index}`} className="tree-view">
              <li><strong>{index + 1}. {chart.name}</strong></li>
              {category !== "artists" && chart.artist?.name && (
                <li>{chart.artist.name}</li>
              )}
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