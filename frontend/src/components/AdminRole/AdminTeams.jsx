import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { getSportLogo } from "../SportsLogoIcon";

/**
 * Admin view: Allows admin to see every team from their university only
 */

function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await api.get("/api/admin/university-teams/");
        setTeams(res.data);
      } catch (err) {
        console.log("Failed to fetch university teams", err);
      }
    };

    fetchTeams();
  }, []);

  if (teams.length === 0) {
    return (
      <p className="text-sm text-center text-gray-600 italic">
        No teams found for your university yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {teams.map((team) => (
        <div
          key={team.id}
          onClick={() => navigate(`/admin-teams/${team.id}/details`)}
          className="p-4 bg-gray-100 rounded shadow hover:shadow-lg hover:bg-blue-50 cursor-pointer transition"
        >
          <img
            src={getSportLogo(team.sport?.name)}
            alt={`${team.sport?.name} logo`}
            className="w-12 h-12 object-contain border rounded-full mb-2"
          />
          <h3 className="text-md font-bold leading-tight">{team.name}</h3>
          <p className="text-sm text-gray-700">Sport: {team.sport?.name}</p>
          <p className="text-sm text-gray-700">University: {team.university?.name}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminTeams;


