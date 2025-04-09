import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import AdminNavi from "../components/AdminNavi";

/**
 * Displays all matches for a specific team.
 */
function AdminTeamFixtures() {
  const { teamId } = useParams();          // Extract teamId from the URL
  const [matches, setMatches] = useState([]); // Store list of matches for the team

  // Fetch the team's match data when the component mounts or teamId changes
  useEffect(() => {
    const fetchTeamMatches = async () => {
      try {
        const res = await api.get(`/api/teams/${teamId}/matches/`);
        setMatches(res.data);
      } catch (err) {
        console.error("Failed to fetch matches", err);
        // TODO: Optionally add user-facing error handling
      }
    };

    fetchTeamMatches();
  }, [teamId]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Admin top navigation */}
      <AdminNavi />

      {/* Main content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Team Fixtures</h1>

        {/* Fallback UI if no matches found */}
        {matches.length === 0 ? (
          <p className="text-gray-600 italic">No matches found for this team.</p>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div
                key={match.id}
                className="border p-4 rounded shadow bg-white"
              >
                <p className="mb-1">
                  <strong>{match.home_team.name}</strong> vs{" "}
                  <strong>{match.away_team.name}</strong>
                </p>

                <p className="text-sm text-gray-700">Date: {match.date}</p>
                <p className="text-sm text-gray-700">Status: {match.status}</p>

                <p className="text-sm text-gray-700">
                  Score: {match.home_score ?? "-"} - {match.away_score ?? "-"}
                </p>

                {/* Edit button only visible if the match is already played */}
                {match.status === "Played" && (
                  <button
                    onClick={() =>
                      alert("Implement score editing modal or page here")
                    }
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
    </div>
  );
}

export default AdminTeamFixtures;

