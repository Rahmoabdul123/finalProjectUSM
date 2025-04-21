import { useEffect, useState } from "react";
import api from "../../api";
import LoadingIndicator from "../LoadingIndicator";

// Displays a team's matches (upcoming and past), and lets the student set their availability for upcoming matches

function TeamMatch({ teamId }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availabilities, setAvailabilities] = useState({});
  // Fetch matches when teamId changes
  useEffect(() => {
    fetchMatches();
  }, [teamId]);

  // Fetches matches + availability for each match
  const fetchMatches = async () => {
    try {
      const res = await api.get(`/api/teams/${teamId}/matches/`);
      setMatches(res.data);

      // Fetchs the student's availability for each match
      for (const match of res.data) {
        try {
          const response = await api.get(`/api/matches/${match.id}/availability/`);
          if (response?.data?.is_attending !== undefined) {
            setAvailabilities((prev) => ({
              ...prev,
              [match.id]: response.data.is_attending,
            }));
          }
        } catch (error) {
          if (error.response?.status === 404) {
            setAvailabilities((prev) => ({ ...prev, [match.id]: undefined }));
          } else {
            console.log(`Error fetching availability for match ${match.id}:`, error);
          }
        }
      }
    } catch (err) {
      console.log("Failed to fetch matches:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvailability = async (matchId, attending) => {
    try {
      await api.post(`/api/matches/${matchId}/availability/`, {
        is_attending: attending,
      });
      setAvailabilities((prev) => ({ ...prev, [matchId]: attending })); // Update immediately in UI
    } catch (err) {
      console.log("Failed to set availability", err);
    }
  };

  const renderMatch = (match) => {
    const attending = availabilities[match.id];
    const isPlayed = match.status === "Played";

    return (
      <div
        key={match.id}
        className="bg-white p-5 rounded-xl shadow hover:shadow-md transition border border-gray-200"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {match.home_team.name} <span className="text-blue-500 font-bold">vs</span> {match.away_team.name}
          </h3>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              isPlayed ? "bg-gray-200 text-gray-700" : "bg-green-100 text-green-700"
            }`}
          >
            {isPlayed ? "Played" : "Upcoming"}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3"> Date: {match.date}</p>

        {isPlayed ? (
          <div className="text-sm font-medium text-gray-800">
            Final Score:
            <span className="ml-2 px-2 py-1 bg-blue-100 rounded text-blue-800">
              {match.home_score} - {match.away_score}
            </span>
          </div>
        ) : (
          // If match is upcoming → show attendance buttons
          <>
            <p className="text-sm italic text-blue-600 mb-3">
              Are you available? Let us know! :)
            </p>

            <div className="flex flex-wrap gap-3 mb-2">
              <button
                aria-label="Mark as available"
                onClick={() => handleAvailability(match.id, true)}
                className={`px-4 py-1 text-sm font-medium rounded-lg focus:outline-none focus:ring ${
                  attending === true
                    ? "bg-green-600 text-white"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
              >
                 Available
              </button>

              <button
                aria-label="Mark as not available"
                onClick={() => handleAvailability(match.id, false)}
                className={`px-4 py-1 text-sm font-medium rounded-lg focus:outline-none focus:ring ${
                  attending === false
                    ? "bg-red-600 text-white"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                }`}
              >
                 Not Available
              </button>
            </div>

            {attending !== undefined && (
              <p className="text-sm text-gray-700">
                You’re marked as{" "}
                <span className={attending ? "text-green-600" : "text-red-600 font-medium"}>
                  {attending ? "Available :)" : "Not Available :("}
                </span>
              </p>
            )}
          </>
        )}
      </div>
    );
  };

  if (loading) return <LoadingIndicator />;

  const upcoming = matches.filter((m) => m.status === "Pending");
  const history = matches.filter((m) => m.status === "Played");

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold mb-3 text-gray-800">📆 Upcoming Matches </h2>
        <h2 className="text-2xl font-bold mb-3 text-gray-800"> START TIME: 2PM </h2>
        {upcoming.length === 0 ? (
          <p className="text-gray-500 italic">No upcoming matches.</p>
        ) : (
          upcoming.map(renderMatch)
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-3 text-gray-800">🕑 Match History</h2>
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



