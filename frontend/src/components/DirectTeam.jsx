import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

/**
 * A shortcut component that shows a grid of all teams the current user belongs to.
 */
function DirectTeam() {
  const [teams, setTeams] = useState([]);         // List of teams the user belongs to
  const navigate = useNavigate();                 // For programmatic navigation

  // Fetch the current user's teams when the component mounts
  useEffect(() => {
    const fetchMyTeams = async () => {
      try {
        const res = await api.get('/api/my-teams/');
        setTeams(res.data);
      } catch (err) {
        console.error('Failed to fetch teams', err);
        // TODO: Add user-facing error message or fallback UI
      }
    };

    fetchMyTeams();
  }, []);

  // Navigate to the team homepage, passing team data in the route state
  const handleTeamClick = (team) => {
    navigate('/team-homepage', { state: { team } });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Quick Access to My Teams</h2>

      {teams.length > 0 ? (
        // Grid layout for team cards
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div
              key={team.id}
              onClick={() => handleTeamClick(team)}
              className="p-4 bg-gray-100 rounded shadow cursor-pointer hover:bg-blue-50 transition"
            >
              <h3 className="text-lg font-bold">{team.name}</h3>
              <p className="text-sm text-gray-700">
                Sport: {team.sport?.name || 'N/A'}
              </p>
              <p className="text-sm text-gray-700">
                University: {team.university?.name || 'N/A'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        // Message if the user isn't part of any teams
        <p className="text-gray-600">You're not in any teams yet.</p>
      )}
    </div>
  );
}

export default DirectTeam;