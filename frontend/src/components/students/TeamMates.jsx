import { useEffect, useState } from "react";
import api from "../../api";
import LoadingIndicator from "../LoadingIndicator";
import { UserRound, Goal } from "lucide-react"; 

function TeamMates({ teamId }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get(`/api/teams/${teamId}/members/`);
        setMembers(res.data);
      } catch (error) {
        console.log("Failed to fetch team members", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [teamId]);

  if (loading) return <LoadingIndicator />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Team Members</h2>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white p-5 rounded-lg shadow hover:shadow-md transition duration-200 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {member.full_name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <UserRound className="inline-block w-4 h-4 mr-1 text-blue-500" />
                  Position:{" "}
                  <span className="font-medium">
                    {member.position || "Not set"}
                  </span>
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-600">
                  <Goal className="inline-block w-4 h-4 mr-1 text-green-600" />
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

export default TeamMates;


