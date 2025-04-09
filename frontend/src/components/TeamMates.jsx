import { useEffect, useState } from "react";
import api from "../api";
import LoadingIndicator from "../components/LoadingIndicator";

/**
 * Displays the list of teammates for a given team.
 * 
 *  - teamId: ID of the team to fetch members for
 */
function TeamMates({ teamId }) {
  const [members, setMembers] = useState([]);         // Stores list of team members
  const [loading, setLoading] = useState(true);       // Loading state for data fetch

  useEffect(() => {
    // Fetch team members from the API when teamId changes
    const fetchMembers = async () => {
      try {
        const res = await api.get(`/api/teams/${teamId}/members/`);  // Call backend endpoint
        setMembers(res.data);  // Save the list of members
      } catch (error) {
        console.error("Failed to fetch team members", error);  // Log any errors
        // TODO: Optionally show an error message to the user here
      } finally {
        setLoading(false);  // Hide loading indicator regardless of success or error
      }
    };

    fetchMembers();
  }, [teamId]);

  // While loading, show a spinner or indicator
  if (loading) return <LoadingIndicator />;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Team Members</h2>

      <ul className="space-y-2">
        {members.map((member) => (
          <li
            key={member.id}
            className="p-3 border rounded shadow bg-white flex flex-col sm:flex-row sm:justify-between"
          >
            {/* Basic info section */}
            <div>
              <p className="font-medium">{member.full_name}</p>
              <p className="text-sm text-gray-600">
                Position: {member.position || "Not set"}
              </p>
            </div>

            {/* Optional stats or meta */}
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

