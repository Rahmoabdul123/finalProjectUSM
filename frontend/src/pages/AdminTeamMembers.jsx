import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import LoadingIndicator from "../components/LoadingIndicator"; 
import { UserRound, Goal } from "lucide-react"; 

/**
*Admin-side: Shows all of the team members and their position and goals
*/

function AdminTeamMembers() {
  const { teamId } = useParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);


  // Fetches team members when the page loads
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get(`/api/admin/teams/${teamId}/members/`);
        setMembers(res.data);
      } catch (err) {
        console.log("Failed to fetch team members", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [teamId]);

  if (loading) return <LoadingIndicator />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Team Members- Approved Members will be here:</h2>

      {/* Members Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white p-5 rounded-lg shadow hover:shadow-md transition duration-200 border border-gray-200"
          >
            {/* Card layout */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-semibold text-gray-800">
                  {member.name}
                </p>
                <p className="text-xl text-gray-600 mt-1">
                  <UserRound className="inline-block w-4 h-4 mr-1 text-blue-500" />
                  Position:{" "}
                  <span className="font-medium">
                    {member.position || "Not set"} {/* shows "Not set" if nothing inputted*/}
                  </span>
                </p>
              </div>
              {/* Right section: Goals scored */}
              <div className="text-right">
                <p className="text-xl text-gray-600">
                  <Goal className="inline-block w-6 h-6 mr-2 text-green-600" />
                  Goals:{" "}
                  <span className="font-bold text-green-700">
                    {member.goals_scored}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminTeamMembers;


