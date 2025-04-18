import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import LoadingIndicator from "../LoadingIndicator";
import { Trophy } from "lucide-react"; 
import { getSportLogo } from "../SportsLogoIcon";

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
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  if (loading) return <LoadingIndicator />;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Trophy className="text-yellow-500 w-7 h-7" /> League Explorer
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {leagues.map((league) => (
          <div
            key={league.id}
            onClick={() => navigate(`/leagues/${league.id}/standings`)}
            className="cursor-pointer p-5 rounded-2xl bg-white shadow hover:shadow-lg hover:scale-[1.02] transition-transform duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={getSportLogo(league.sport_name)}
                alt={`${league.sport_name} icon`}
                className="w-8 h-8 object-contain"
              />
              <h3 className="text-2xl font-semibold text-blue-800">{league.name}</h3>
          </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium text-gray-700">Sport:</span>{" "}
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {league.sport_name || "N/A"}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-700">Gender:</span>{" "}
                <span className="inline-block bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full">
                  {league.gender || "-"}
                </span>
              </p>
            </div>

            <button className="mt-4 text-sm text-blue-600 hover:underline font-medium">
              View Standings →
            </button>
          </div>
        ))}

        {!leagues.length && (
          <p className="text-gray-600 italic col-span-full">No leagues available right now.</p>
        )}
      </div>
    </div>
  );
}

export default LeagueFind;


