import { useEffect, useState } from "react";
import api from "../api";
import LoadingIndicator from "./LoadingIndicator";

function MatchUpcoming() {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get("/api/my-matches/");
        if (res.data && res.data.upcoming && res.data.upcoming.length > 0) {
          setMatch(res.data.upcoming[0]); // first upcoming match
        }
      } catch (err) {
        console.log("Couldn't load matches", err);
        // maybe alert user in future or use toast
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) return <LoadingIndicator />;

  if (!match) {
    return <p style={{ color: "#4b5563", fontStyle: "italic" }}>No upcoming matches.</p>;
  }

  const formattedDate = match.date ? new Date(match.date).toLocaleString() : "TBD";

  return (
    <div className="bg-white shadow p-6 rounded-lg mt-6 max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Upcoming Match</h2>

      <div className="mb-4">
        <p className="text-lg font-semibold text-gray-800">
          <span className="text-green-700">Home:</span> {match.home_team && match.home_team.name ? match.home_team.name : "TBD"}
        </p>
        <p className="text-lg font-semibold text-gray-800">
          <span className="text-red-700">Away:</span> {match.away_team && match.away_team.name ? match.away_team.name : "TBD"}
        </p>
      </div>

      <p className="text-md text-gray-700 mb-2"> {formattedDate}</p>

    </div>
  );
}

export default MatchUpcoming;


