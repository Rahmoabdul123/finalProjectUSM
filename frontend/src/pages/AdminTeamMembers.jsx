import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

//** Admin view: Displays a list of all players in a specific team.
function AdminTeamMembers() {
  const { teamId } = useParams();         
  const [members, setMembers] = useState([]);// Store fetched team members

  // Fetch team members on component mount or when teamId changes
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get(`/api/admin/teams/${teamId}/members/`);
        setMembers(res.data);
      } catch (err) {
        console.log("Failed to fetch team members", err);
        // TODO: Optional: Show user-friendly error message
      }
    };

    fetchMembers();
  }, [teamId]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Team Members</h1>

        {/* Fallback message if no members are found */}
        {members.length === 0 ? (
          <p className="text-gray-600 italic">No members found for this team.</p>
        ) : (
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-white shadow p-4 rounded"
              >
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-gray-700">
                  Position: {member.position || "N/A"}
                </p>
                <p className="text-sm text-gray-700">
                  Goals Scored: {member.goals_scored}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminTeamMembers;

