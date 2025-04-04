import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import StudentHeader from "../components/studentHeader";

function MyTeams() {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await api.get("/api/my-teams/");
        setTeams(res.data);
      } catch (err) {
        console.error("Failed to fetch teams", err);
      }
    };
    fetchTeams();
  }, []);

  return (
    <div className="p-4">
      <StudentHeader />
      <h1 className="text-2xl font-bold mb-4">My Teams</h1>
      {teams.length === 0 ? (
        <p>You have not joined any teams yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="border p-4 rounded shadow cursor-pointer hover:bg-gray-100"
              onClick={() => navigate("/team-homepage", { state: { team } })}
            >
              <h2 className="text-xl font-semibold">{team.name}</h2>
              <p className="text-gray-600">Sport: {team.sport.name}</p>
              <p className="text-gray-600">University: {team.university.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTeams;
