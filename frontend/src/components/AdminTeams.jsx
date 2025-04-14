import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

/**
 * Admin view that lists all teams under the user's university.
 * admins can then click on any of them to see their matches to then edit scores if needed
 */
function AdminTeams() {
  const [teams, setTeams] = useState([]);   // List of university teams available to the admin
  const navigate = useNavigate();           // For navigating to the team’s fixture management page

  // Fetch university teams when the component mounts
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await api.get("/api/admin/university-teams/");
        setTeams(res.data);
      } catch (err) {
        console.log("Failed to fetch university teams", err);
        // TODO: Add user-visible error message or retry option
      }
    };

    fetchTeams();
  }, []);

  // Fallback UI if no teams found
  if (teams.length === 0) {
    return (
      <p className="mt-4 text-center text-gray-600 italic">
        No teams found for your university yet.
      </p>
    );
  }

  return (
    <div className="mt-8 px-6">
      <h2 className="text-2xl font-bold mb-4">Your University Teams</h2>

      {/* Grid layout for team cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div
            key={team.id}
            onClick={() => navigate(`/admin-teams/${team.id}/details`)}
            className="cursor-pointer border p-4 bg-white shadow-md hover:bg-blue-50 rounded transition"
          >
            <h3 className="text-xl font-semibold mb-1">{team.name}</h3>
            <p className="text-sm text-gray-600">Sport: {team.sport?.name || "N/A"}</p>
            <p className="text-sm text-gray-600">University: {team.university?.name || "N/A"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminTeams;
