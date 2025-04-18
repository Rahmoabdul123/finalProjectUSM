import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import StudentHeader from "../components/studentHeader";
import { getSportLogo } from "../components/SportsLogoIcon";

function MyTeams() {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await api.get("/api/my-teams/");
        setTeams(res.data);
      } catch (err) {
        console.log("Failed to fetch teams", err);
      }
    };
    fetchTeams();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Teams</h1>

        {teams.length === 0 ? (
          <p className="text-gray-600">You have not joined any teams yet.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <div
                key={team.id}
                tabIndex={0}
                role="button"
                onClick={() => navigate("/team-homepage", { state: { team } })}
                onKeyDown={(e) => e.key === "Enter" && navigate("/team-homepage", { state: { team } })}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg hover:scale-[1.01] transition-transform cursor-pointer outline-none focus:ring-2 focus:ring-blue-400"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={getSportLogo(team.sport.name)}
                    alt={`${team.sport.name} logo`}
                    className="w-12 h-12 rounded-full object-contain border"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{team.name}</h2>
                    <p className="text-sm text-gray-500">{team.sport.name}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  University: <span className="font-medium">{team.university.name}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTeams;

