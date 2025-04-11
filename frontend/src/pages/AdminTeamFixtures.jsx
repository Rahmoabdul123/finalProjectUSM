import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import AdminNavi from "../components/AdminNavi";
import EditScore from "../components/EditScore";

/**
 * Allows admins to view match details and edit scores for completed matches.
 */
function AdminTeamFixtures() {
  const { teamId } = useParams();
  const [matches, setMatches] = useState([]);              
  const [selectedMatch, setSelectedMatch] = useState(null); 

  /**
   * Fetch all matches for the team.
   * Can be reused after score edits to refresh the list.
   */
  const fetchTeamMatches = async () => {
    try {
      const res = await api.get(`/api/teams/${teamId}/matches/`);
      setMatches(res.data);
    } catch (err) {
      console.error("Failed to fetch matches", err);
      // TODO: Add alert for error
    }
  };

  // Load match data on component mount (or if teamId changes)
  useEffect(() => {
    fetchTeamMatches();
  }, [teamId]);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavi />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Team Fixtures</h1>

        {/* No matches fallback */}
        {matches.length === 0 ? (
          <p className="text-gray-600 italic">No matches found</p>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div
                key={match.id}
                className="border p-4 rounded shadow bg-white"
              >
                {/* Match info */}
                <p className="mb-1">
                  <strong>{match.home_team.name}</strong> vs{" "}
                  <strong>{match.away_team.name}</strong>
                </p>
                <p className="text-sm text-gray-700">Date: {match.date}</p>
                <p className="text-sm text-gray-700">Status: {match.status}</p>
                <p className="text-sm text-gray-700">
                  Score: {match.home_score ?? "-"} - {match.away_score ?? "-"}
                </p>

                {/* Show edit button only if match is marked as 'Played' */}
                {match.status === "Played" && (
                  <button
                    onClick={() => setSelectedMatch(match)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Edit Score
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Score editing panel */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <EditScore
              match={selectedMatch}
              onClose={() => setSelectedMatch(null)}
              onScoreUpdated={fetchTeamMatches} // Refresh after edit
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTeamFixtures;

