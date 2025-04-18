import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import EditScore from "../components/AdminRole/EditScore";
import AdminAssignGoals from "../components/AdminRole/AdminAssignGoals";

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
      console.error("Failed to fetch matches", err);
    }
  };

  useEffect(() => {
    fetchTeamMatches();
  }, [teamId]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Team Fixtures</h1>

        {matches.length === 0 ? (
          <p className="text-gray-600 italic text-center">No matches found</p>
        ) : (
          <div className="space-y-6">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-white border rounded-xl shadow-sm p-6 hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                  <div className="text-lg font-semibold text-gray-800">
                    {match.home_team.name} <span className="text-blue-600 font-bold">vs</span> {match.away_team.name}
                  </div>
                  <div className="text-sm text-gray-500 mt-2 sm:mt-0">
                    {new Date(match.date).toLocaleDateString()}
                  </div>
                </div>

                <div className="text-sm text-gray-700 space-y-1 mb-4">
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      match.status === "Played"
                        ? "bg-green-100 text-green-700"
                        : match.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {match.status}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Score:</span>{" "}
                    {match.home_score ?? "-"} - {match.away_score ?? "-"}
                  </p>
                </div>

                {/* Action Buttons */}
                {["Played", "Pending"].includes(match.status) && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setSelectedMatch(match)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                      Edit Score
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/admin/matches/${match.id}/availability`)
                      }
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition"
                    >
                      View Availability
                    </button>

                    {match.status === "Played" && (
                      <button
                        onClick={() => {
                          setSelectedMatch(match);
                          setShowAssignGoals(true);
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
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

      {/* Edit Score Modal */}
      {selectedMatch && !showAssignGoals && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
            <EditScore
              match={selectedMatch}
              onClose={() => setSelectedMatch(null)}
              onScoreUpdated={fetchTeamMatches}
            />
          </div>
        </div>
      )}

      {/* Assign Goals Modal */}
      {showAssignGoals && selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
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

