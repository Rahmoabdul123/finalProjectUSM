import { useEffect, useState } from "react";
import api from "../api";
import LoadingIndicator from "./LoadingIndicator";

/**
 * Displays the league standings table for a given league.
 * - leagueId: ID of the league to fetch standings for
 */
function LeagueStandings({ leagueId }) {
  const [standings, setStandings] = useState([]);     // League table data
  const [loading, setLoading] = useState(true);       // Tracks loading state

  // Fetch league standings whenever the leagueId changes
  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const res = await api.get(`/api/leagues/${leagueId}/standings/`);
        setStandings(res.data);
      } catch (err) {
        console.log("Failed to fetch standings:", err);
        // TODO: Add error message UI for better user feedback
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [leagueId]);

  // Show a loading indicator while waiting for API response
  if (loading) return <LoadingIndicator />;

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4">League Standings</h2>

      {/* League standings table */}
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
            <tr key={team.team_id} className="border-t">
              <td className="py-2 px-4 font-bold">{index + 1}</td>
              <td className="py-2 px-4">{team.team_name}</td>
              <td className="py-2 px-4">{team.played}</td>
              <td className="py-2 px-4">{team.won}</td>
              <td className="py-2 px-4">{team.draw}</td>
              <td className="py-2 px-4">{team.lost}</td>
              <td className="py-2 px-4">
                {team.goals_scored} - {team.goals_conceded}
              </td>
              <td className="py-2 px-4">{team.goal_difference}</td>
              <td className="py-2 px-4 font-semibold">{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeagueStandings
