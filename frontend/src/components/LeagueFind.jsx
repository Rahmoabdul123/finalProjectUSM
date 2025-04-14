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
        setLeagues(res.data || []);
      } catch (err) {
        console.log("Failed to fetch leagues:", err);
        // TODO: show error message to user
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  if (loading) return <LoadingIndicator />;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">League Explorer</h1>

      <div className="space-y-4">
        {leagues.map((league) => (
          <div
            key={league.id}
            onClick={() => navigate(`/leagues/${league.id}/standings`)}
            className="p-4 border rounded-xl shadow bg-white hover:bg-blue-50 cursor-pointer transition"
          >
            <h2 className="text-lg font-semibold">{league.name}</h2>
            <p className="text-sm text-gray-500">
              Sport: {league.sport_name || "N/A"}
            </p>
            <p className="text-sm text-gray-500">
              Gender: {league.gender || "-"}
            </p>
            <p className="mt-3 text-blue-600 font-medium hover:underline">
              View Standings →
            </p>
          </div>
        ))}

        {!leagues.length && (
          <p className="text-gray-600 italic">No leagues available right now.</p>
        )}
      </div>
    </div>
  );
}

export default LeagueFind;

