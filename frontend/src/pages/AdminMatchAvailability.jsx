import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import AdminNavi from "../components/AdminNavi";

/**
 * Admin view: Displays player availability for a specific match,
 */
function AdminMatchAvailability() {
  const { matchId } = useParams();

  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const [homeTeamName, setHomeTeamName] = useState("");
  const [awayTeamName, setAwayTeamName] = useState("");

  // Fetch availability data when matchId is available or changes
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await api.get(`/api/admin/matches/${matchId}/availability/`);
        setHomePlayers(res.data.home_team_players);
        setAwayPlayers(res.data.away_team_players);
        setHomeTeamName(res.data.home_team);
        setAwayTeamName(res.data.away_team);
      } catch (err) {
        console.log("Failed to load match availability", err);
        // TODO: Add error UI or retry logic
      }
    };

    fetchAvailability();
  }, [matchId]);

  // Renders an individual player's attendance response
  const renderPlayer = (player) => (
    <div key={player.user} className="bg-white shadow p-3 rounded mb-2">
      <p className="font-medium">{player.user}</p>
      <p>
        Status:{" "}
        <span className={player.is_attending ? "text-green-600" : "text-red-600"}>
          {player.is_attending ? "Attending" : "Not Attending"}
        </span>
      </p>
      <p className="text-sm text-gray-600">
        Responded At: {new Date(player.responded_at).toLocaleString()}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavi />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Match Availability</h1>

        {/* Side-by-side layout for teams so admins can see clearly their available players */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Home Team Availability */}
          <div>
            <h2 className="text-xl font-semibold mb-2">{homeTeamName}</h2>
            {homePlayers.length === 0 ? (
              <p className="text-gray-500">No responses yet.</p>
            ) : (
              homePlayers.map(renderPlayer)
            )}
          </div>

          {/* Away Team Availability */}
          <div>
            <h2 className="text-xl font-semibold mb-2">{awayTeamName}</h2>
            {awayPlayers.length === 0 ? (
              <p className="text-gray-500">No responses yet.</p>
            ) : (
              awayPlayers.map(renderPlayer)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminMatchAvailability;


