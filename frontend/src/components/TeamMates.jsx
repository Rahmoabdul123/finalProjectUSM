import { useEffect, useState } from "react";
import api from "../api";

function TeamMates({ teamId }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get(`/api/teams/${teamId}/members/`); //fetching teammates
        setMembers(res.data);
      } catch (error) {
        console.error("Failed to fetch team members", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [teamId]);

  if (loading) return <p>Loading team members...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Team Members</h2>
      <ul className="space-y-2">
        {members.map((member) => (
          <li
            key={member.id}
            className="p-3 border rounded shadow bg-white flex flex-col sm:flex-row sm:justify-between"
          >
            <div>
              <p className="font-medium">{member.full_name}</p>
              <p className="text-sm text-gray-600">Position: {member.position || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Goals: {member.goals_scored}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamMates;
