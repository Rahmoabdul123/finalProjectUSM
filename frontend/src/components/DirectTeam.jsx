import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { getSportLogo } from "../components/SportsLogoIcon";

function DirectTeam() {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await api.get('/api/my-teams/');
        setTeams(res.data);
      } catch (err) {
        console.log('Error loading teams', err); // maybe show toast later
      }
    };

    fetchTeams();
  }, []);

  const handleClick = (team) => {
    // quick nav to team homepage, pass full object
    navigate('/team-homepage', { state: { team } });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Quick Access to My Teams</h2>

      {teams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div
              key={team.id}
              onClick={() => handleClick(team)}
              className="p-4 bg-gray-100 rounded shadow hover:bg-blue-50 cursor-pointer transition"
            >
              <img
                src={getSportLogo(team.sport?.name)}
                alt={`${team.sport?.name || "Sport"} logo`}
                className="w-12 h-12 object-contain border rounded-full mb-2"
              />
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
        <p className="text-gray-600">You're not in any teams yet.</p>
      )}
    </div>
  );
}

export default DirectTeam;
