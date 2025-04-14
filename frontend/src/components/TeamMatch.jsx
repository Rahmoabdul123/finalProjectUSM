import { useEffect, useState } from "react";
import api from "../api";
import LoadingIndicator from "../components/LoadingIndicator";

/**
 * Displays a list of matches for a team and allows the user to set their availability
 * for upcoming matches.
 * 
 * Props:
 *  - teamId: the team whose matches will be fetched
 */
function TeamMatch({ teamId }) {
  const [matches, setMatches] = useState([]);         // List of matches for the team
  const [loading, setLoading] = useState(true);       // Loading state
  const [availabilities, setAvailabilities] = useState({}); // Track user's availability by matchId

  useEffect(() => {
    fetchMatches();  // Load data when the component mounts or teamId changes
  }, [teamId]);

  // Fetch matches for the team and availability for each match
  const fetchMatches = async () => {
    try {
      const res = await api.get(`/api/teams/${teamId}/matches/`);
      setMatches(res.data);

      // Fetch availability individually for each match
      for (const match of res.data) {
        try {
          const response = await api.get(`/api/matches/${match.id}/availability/`);

          // If the user has responded, update the local availability state
          if (response?.data?.is_attending !== undefined) {
            setAvailabilities((prev) => ({
              ...prev,
              [match.id]: response.data.is_attending,
            }));
          }
        } catch (error) {
          // A 404 means no availability has been recorded yet — not an error
          if (error.response?.status === 404) {
            setAvailabilities((prev) => ({ ...prev, [match.id]: undefined }));
          } else {
            console.log(`Error fetching availability for match ${match.id}:`, error);
          }
        }
      }
    } catch (err) {
      console.log("Failed to fetch matches:", err);
      // TODO: You could set an error state here and show a message to the user
    } finally {
      setLoading(false);
    }
  };

  // Submit the player's availability for a specific match
  const handleAvailability = async (matchId, attending) => {
    try {
      await api.post(`/api/matches/${matchId}/availability/`, {
        is_attending: attending,
      });
      setAvailabilities((prev) => ({ ...prev, [matchId]: attending }));
    } catch (err) {
      console.log("Failed to set availability", err);
    }
  };

  // Render a single match card
  const renderMatch = (match) => {
    const attending = availabilities[match.id];

    return (
      <div
        key={match.id}
        className="border rounded p-4 mb-4 bg-white shadow"
      >
        <p className="font-semibold text-lg mb-1">
          {match.home_team.name} vs {match.away_team.name}
        </p>

        <p className="text-sm text-gray-600 mb-2">Date: {match.date}</p>

        {match.status === "Played" ? (
          // Show final score
          <p className="text-sm">Score: {match.home_score} - {match.away_score}</p>
        ) : (
          <>
            {/* Match is upcoming — show availability controls */}
            <p className="text-sm text-blue-600 mb-2 italic">
              Upcoming match — let your team know if you can make it!
            </p>

            <div className="flex gap-3 mb-1">
              <button
                onClick={() => handleAvailability(match.id, true)}
                className={`px-3 py-1 rounded border ${
                  attending === true
                    ? "bg-green-600 text-white"
                    : "hover:bg-green-100"
                }`}
              >
                 Available
              </button>

              <button
                onClick={() => handleAvailability(match.id, false)}
                className={`px-3 py-1 rounded border ${
                  attending === false
                    ? "bg-red-600 text-white"
                    : "hover:bg-red-100"
                }`}
              >
                 Not Available
              </button>
            </div>

            {/* Show the user's current selection */}
            {attending !== undefined && (
              <p className="text-sm text-gray-700">
                You’re marked as{" "}
                <span
                  className={attending ? "text-green-600" : "text-red-600"}
                >
                  {attending ? "Available :)" : "Not Available :("}
                </span>
              </p>
            )}
          </>
        )}
      </div>
    );
  };

  // Show a loading spinner while fetching data
  if (loading) return <LoadingIndicator />;

  // Separate upcoming and past matches for display
  const upcoming = matches.filter((m) => m.status === "Pending");
  const history = matches.filter((m) => m.status === "Played");

  return (
    <div className="space-y-8">
      {/* Upcoming Matches */}
      <div>
        <h2 className="text-2xl font-bold mb-3">Upcoming Matches</h2>
        {upcoming.length === 0 ? (
          <p className="text-gray-500 italic">No upcoming matches.</p>
        ) : (
          upcoming.map(renderMatch)
        )}
      </div>

      {/* Match History */}
      <div>
        <h2 className="text-2xl font-bold mb-3">Match History</h2>
        {history.length === 0 ? (
          <p className="text-gray-500 italic">No past matches yet.</p>
        ) : (
          history.map(renderMatch)
        )}
      </div>
    </div>
  );
}

export default TeamMatch;


