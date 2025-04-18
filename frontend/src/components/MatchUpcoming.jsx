import { useEffect, useState } from "react";
import api from "../api";
import LoadingIndicator from "./LoadingIndicator";
import { Home, Users , Clock} from "lucide-react"; // Using icons from lucide-react

function MatchUpcoming() {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get("/api/my-matches/");
        if (res.data.upcoming && res.data.upcoming.length > 0) {
          setMatch(res.data.upcoming[0]);
        }
      } catch (err) {
        console.error("Failed to fetch matches", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) return <LoadingIndicator />;
  if (!match) return <p className="text-gray-600">No upcoming matches.</p>;

  return (
    <div className="bg-white shadow-lg p-8 rounded-xl mt-6 max-w-3xl mx-auto text-center border">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">Upcoming Match</h2>

      <div className="flex items-center justify-center space-x-2 mb-6">
        <Clock />
        <h3 className="text-3xl font-semibold text-red-800"> 2pm </h3>
      </div>

      <div className="flex items-center justify-center gap-8 text-xl font-semibold text-gray-800">
        {/* Home Team */}
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-green-600" />
          <span className="text-green-700">{match.home_team?.name}</span>
        </div>

        {/* VS in center */}
        <div className="text-4xl font-bold text-red-600">VS</div>

        {/* Away Team */}
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-red-600" />
          <span className="text-red-700">{match.away_team?.name}</span>
        </div>
      </div>

      {/* Date */}
      <p className="mt-6 text-lg text-gray-700">
         {new Date(match.date).toLocaleDateString()}
      </p>
    </div>
  );
}

export default MatchUpcoming;



