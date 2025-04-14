import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import EditScore from "../components/EditScore";
import AdminAssignGoals from "../components/AdminAssignGoals";

function AdminTeamFixtures() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showAssignGoals, setShowAssignGoals] = useState(false);

  const fetchTeamMatches = async () => {
    try {
      const res = await api.get(`/api/teams/${teamId}/matches/`);
      setMatches(res.data);
    } catch (err) {
      console.log("Failed to fetch matches", err);
    }
  };

  useEffect(() => {
    fetchTeamMatches();
  }, [teamId]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Team Fixtures</h1>

        {matches.length === 0 ? (
          <p className="text-gray-600 italic">No matches found</p>
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

                {["Played", "Pending"].includes(match.status) && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedMatch(match)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Edit Score
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/admin/matches/${match.id}/availability`)
                      }
                      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                    >
                      View Availability
                    </button>

                    {match.status === "Played" && (
                      <button
                        onClick={() => {
                          setSelectedMatch(match);
                          setShowAssignGoals(true);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        Assign Goals
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <EditScore
              match={selectedMatch}
              onClose={() => setSelectedMatch(null)}
              onScoreUpdated={fetchTeamMatches}
            />
          </div>
        </div>
      )}

      {showAssignGoals && selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <AdminAssignGoals
              matchId={selectedMatch.id}
              teamId={teamId}
              onClose={() => {
                setShowAssignGoals(false);
                setSelectedMatch(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTeamFixtures;

