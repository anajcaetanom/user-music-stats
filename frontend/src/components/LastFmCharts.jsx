import { useData } from "@context/DataContext";

export const LastFmCharts = ({charts}) => {
  const { username, timespan, category, profilePic} = useData();

  const usernameFormatado = username.charAt(0).toUpperCase() + username.slice(1);

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
      <div className="msn-header">
        <div className="profile-pic">
          <img src={profilePic}/>
        </div>
        <div className="text">
          <div className="user-name">
            <p><strong>{usernameFormatado}</strong> (Online) </p>
          </div>
          <div className="user-description">
            <p> {username.toUpperCase()}'s Top {categoryMap[category]} in the {timespanMap[timespan]}. </p>
          </div>
        </div>
      </div>
      <div className="spacer" />
      <div className="charts">
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
    </div>
  );
};