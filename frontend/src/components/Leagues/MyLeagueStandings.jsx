import { useEffect, useState } from "react";
import api from "../../api";
import LoadingIndicator from "../LoadingIndicator";

function MyLeagueStandings({ teamId, leagueId, teamName }) {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const res = await api.get(`/api/leagues/${leagueId}/standings/`);
        setStandings(res.data);
      } catch (err) {
        console.log("Failed to fetch standings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [leagueId]);

  if (loading) return <LoadingIndicator />;

  const yourTeamIndex = standings.findIndex((team) => team.team_name === teamName);

  return (
    <div className="overflow-x-auto bg-white shadow-xl rounded-xl p-6">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">📊 Your League Standings</h2>

      {yourTeamIndex !== -1 && (
        <p className="text-lg font-medium text-blue-700 mb-4">
          Your team is currently ranked{" "}
          <span className="text-xl font-bold text-black">#{yourTeamIndex + 1}</span> in the league.
        </p>
      )}

      <div className="overflow-auto">
        <table className="min-w-full border text-base text-center">
          <thead className="bg-blue-100 text-blue-900 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4 text-left">Team</th>
              <th className="py-3 px-4">Played</th>
              <th className="py-3 px-4">Won</th>
              <th className="py-3 px-4">Draw</th>
              <th className="py-3 px-4">Lost</th>
              <th className="py-3 px-4">Goals</th>
              <th className="py-3 px-4">GD</th>
              <th className="py-3 px-4">Points</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {standings.map((team, index) => {
              const isCurrent = team.team_name === teamName;
              return (
                <tr
                  key={team.team_id}
                  className={`transition duration-200 ${
                    isCurrent ? "bg-yellow-100 font-semibold text-black" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 text-left whitespace-nowrap">
                    {team.team_name}
                    {isCurrent && (
                      <span className="ml-2 inline-block bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                        YOU
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">{team.played}</td>
                  <td className="py-3 px-4">{team.won}</td>
                  <td className="py-3 px-4">{team.draw}</td>
                  <td className="py-3 px-4">{team.lost}</td>
                  <td className="py-3 px-4 text-sm text-blue-700 font-medium">
                    {team.goals_scored} - {team.goals_conceded}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{team.goal_difference}</td>
                  <td className="py-3 px-4 font-bold text-green-700">{team.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyLeagueStandings;


