import { useEffect, useState } from "react";
import api from "../api";
import LoadingIndicator from "./LoadingIndicator";

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
        console.log("Error loading scorers:", err); // not overly formal
        // TODO: maybe show UI fallback or error box
      } finally {
        setLoading(false);
      }
    };

    fetchScorers();
  }, [teamId, leagueId]);

  if (loading) return <LoadingIndicator />;

  const renderList = (scorers) => {
    if (!scorers || !scorers.length) return <p>No scorers yet.</p>;

    return (
      <ul className="space-y-2">
        {scorers.map((p, i) => (
          <li
            key={`${p.user_id}-${i}`} // might adjust key later
            className="bg-white border rounded p-3 shadow flex justify-between items-center"
          >
            <span>
              <strong>{i + 1}. {p.name}</strong>
            </span>
            <span className="text-sm text-gray-600">Goals: {p.total_goals}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Top 5 Team Scorers</h2>
      {renderList(teamScorers)}

      <h2 className="text-xl font-bold mt-10 mb-4">Top 5 League Scorers</h2>
      {renderList(leagueScorers)}
    </div>
  );
}

export default TopScorers;


