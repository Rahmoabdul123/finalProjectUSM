import { useEffect, useState } from "react";
import api from "../api";
import LoadingIndicator from "./LoadingIndicator";

/**
 * Displays the league standings table for a team,
 * highlighting the user's team rank.
 */
function MyLeagueStandings({ teamId, leagueId, teamName }) {
  const [standings, setStandings] = useState([]);     // Full league standings
  const [loading, setLoading] = useState(true);       // Loading state for standings

  // Fetch league standings on component mount or when leagueId changes
  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const res = await api.get(`/api/leagues/${leagueId}/standings/`);
        setStandings(res.data);
      } catch (err) {
        console.error("Failed to fetch standings:", err);
        // TODO: Add user-friendly error UI if needed
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [leagueId]);

  // Show loading indicator while data is being fetched
  if (loading) return <LoadingIndicator />;

  // Find index of the user's team for personalized messaging
  const yourTeamIndex = standings.findIndex((team) => team.team_name === teamName);

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4">Your League Standings</h2>

      {/* Show current rank if the user's team is found in the standings */}
      {yourTeamIndex !== -1 && (
        <p className="text-lg font-semibold text-blue-800 mb-4">
          Your team is currently ranked{" "}
          <span className="font-bold">#{yourTeamIndex + 1}</span> in the league.
        </p>
      )}

      {/* Standings Table */}
      <table className="min-w-full text-sm text-center border">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4">#</th>
            <th className="py-2 px-4">Team</th>
            <th className="py-2 px-4">Played</th>
            <th className="py-2 px-4">Won</th>
            <th className="py-2 px-4">Draw</th>
            <th className="py-2 px-4">Lost</th>
            <th className="py-2 px-4">Goals</th>
            <th className="py-2 px-4">GD</th>
            <th className="py-2 px-4">Points</th>
          </tr>
        </thead>

        <tbody>
          {standings.map((team, index) => (
            <tr
              key={team.team_id}
              className={`border-t ${
                team.team_name === teamName ? "bg-yellow-100 font-bold" : ""
              }`}
            >
              {/* Ranking position */}
              <td className="py-2 px-4">{index + 1}</td>

              {/* Team name and "YOU" badge */}
              <td className="py-2 px-4">
                {team.team_name}
                {team.team_name === teamName && (
                  <span className="ml-2 text-blue-600 text-xs font-semibold">(YOU)</span>
                )}
              </td>

              <td className="py-2 px-4">{team.played}</td>
              <td className="py-2 px-4">{team.won}</td>
              <td className="py-2 px-4">{team.draw}</td>
              <td className="py-2 px-4">{team.lost}</td>

              {/* Goals formatted as "scored - conceded" */}
              <td className="py-2 px-4">
                {team.goals_scored} - {team.goals_conceded}
              </td>

              <td className="py-2 px-4">{team.goal_difference}</td>
              <td className="py-2 px-4">{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyLeagueStandings;

