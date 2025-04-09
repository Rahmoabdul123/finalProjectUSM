import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import LoadingIndicator from "../components/LoadingIndicator";

function LeagueFind() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const res = await api.get("/api/leagues/");
        setLeagues(res.data);
      } catch (err) {
        console.error("Failed to fetch leagues", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeagues();
  }, []);

  if (loading) return <LoadingIndicator />;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">League Explorer</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {leagues.map((league) => (
          <div
          key={league.id}
          onClick={() => navigate(`/leagues/${league.id}/standings`)}
          className="p-4 border rounded shadow bg-white hover:bg-blue-50 cursor-pointer transition"
        >
          <h2 className="text-lg font-semibold">{league.name}</h2>
          <p className="text-sm text-gray-500">Sport: {league.sport_name}</p>
          <p className="text-sm text-gray-500">Gender: {league.gender}</p>
          <p className="mt-3 text-blue-600 font-medium hover:underline">View Standings →</p>
        </div>
        ))}
        </div>
    </div>
  );
}

export default LeagueFind;
