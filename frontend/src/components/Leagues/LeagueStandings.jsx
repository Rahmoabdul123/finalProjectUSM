import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import LoadingIndicator from "../LoadingIndicator";
import StudentHeader from "../studentHeader";
import AdminNavi from "../AdminNavi";

// Displays the league standings table for a given league.

function LeagueStandings() {
  const { leagueId } = useParams();

  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  

  useEffect(() => {
    setRole(localStorage.getItem("role") || "");
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

  return (
    <>
      {role === "Admin" ? <AdminNavi /> : <StudentHeader />}
      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-4xl font-extrabold text-blue-900 mb-8 flex items-center gap-3">
          🏆 League Standings
        </h2>

        <table className="min-w-full table-auto text-lg text-center border-collapse">
          <thead className="bg-blue-200 text-blue-900">
            <tr className="uppercase tracking-wide">
              <th className="py-4 px-6 font-bold">#</th>
              <th className="py-4 px-6 font-bold text-left">Team</th>
              <th className="py-4 px-6 font-bold">Played</th>
              <th className="py-4 px-6 font-bold">Won</th>
              <th className="py-4 px-6 font-bold">Draw</th>
              <th className="py-4 px-6 font-bold">Lost</th>
              <th className="py-4 px-6 font-bold">Goals</th>
              <th className="py-4 px-6 font-bold">GD</th>
              <th className="py-4 px-6 font-bold">Points</th>
            </tr>
          </thead>

          <tbody>
            {standings.map((team, index) => (
              <tr
                key={team.team_id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="py-4 px-6 font-bold text-gray-800">{index + 1}</td>
                <td className="py-4 px-6 text-left font-semibold text-gray-900">
                  {team.team_name}
                </td>
                <td className="py-4 px-6">{team.played}</td>
                <td className="py-4 px-6">{team.won}</td>
                <td className="py-4 px-6">{team.draw}</td>
                <td className="py-4 px-6">{team.lost}</td>
                <td className="py-4 px-6">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                    {team.goals_scored} - {team.goals_conceded}
                  </span>
                </td>
                <td className="py-4 px-6">{team.goal_difference}</td>
                <td className="py-4 px-6 font-extrabold text-green-700">
                  {team.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default LeagueStandings
