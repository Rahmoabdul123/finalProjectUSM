import { useEffect, useState } from "react";
import api from "../../api";
import LoadingIndicator from "../LoadingIndicator";
import { Medal } from "lucide-react"; 

// Component: Displays Top 5 Scorers for both the Team and League
function TopScorers({ teamId, leagueId }) {
  const [teamScorers, setTeamScorers] = useState([]);
  const [leagueScorers, setLeagueScorers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScorers = async () => {
      try {
        const teamRes = await api.get(`/api/teams/${teamId}/top-scorers/`);
        const leagueRes = await api.get(`/api/leagues/${leagueId}/top-scorers/`);
        setTeamScorers(teamRes.data || []);
        setLeagueScorers(leagueRes.data || []);
      } catch (err) {
        console.log("Error loading scorers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScorers();
  }, [teamId, leagueId]);

  if (loading) return <LoadingIndicator />;

  const renderList = (scorers, isTeam) => {
    if (!scorers || scorers.length === 0) return <p className="text-gray-500">No scorers yet.</p>;

    return (
      <ul className="space-y-3">
        {scorers.map((p, i) => (
          <li
            key={`${p.user_id}-${i}`}
            className={`flex justify-between items-center p-4 rounded-xl shadow-md ${
              i === 0
                ? "bg-yellow-100 border border-yellow-400"
                : "bg-white border border-gray-200"
            } hover:shadow-lg transition`}
          >
            <div className="flex items-center gap-3">
              {i === 0 ? (
                <Medal className="text-yellow-500 w-5 h-5" />
              ) : (
                <span className="font-semibold text-gray-600">{i + 1}.</span>
              )}
              <span className="text-lg font-medium text-gray-800">{p.name}</span>
            </div>
            <span className="text-blue-700 font-semibold">⚽ {p.total_goals}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="mt-6 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Top 5 Team Scorers</h2>
      {renderList(teamScorers, true)}

      <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4">Top 5 League Scorers</h2>
      {renderList(leagueScorers, false)}
    </div>
  );
}

export default TopScorers;



