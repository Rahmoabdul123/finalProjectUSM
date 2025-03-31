import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import StudentHeader from "../components/studentHeader";

function FindTeam() {
  const [teams, setTeams] = useState([]);
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTeams();
    fetchSports();
  }, [selectedSport]);

  const fetchTeams = async () => {
    try {
      const response = await api.get("/api/teams-by-university/", {
        params: selectedSport ? { sport: selectedSport } : {},
      });
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching teams", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSports = async () => {
    try {
      const response = await api.get("/api/sports/");
      setSports(response.data);
    } catch (error) {
      console.error("Error fetching sports", error);
    }
  };

  const handleJoinRequest = async (teamId) => {
    try {
      const response = await api.post(`/api/teams/${teamId}/join/`);
      setMessage(response.data.detail);
      alert("Join request submitted.");
    } catch (error) {
      setMessage(error.response?.data?.detail || "An error occurred.");
      alert("Failed to send join request.");
    }
  };

  return (
    <div className="p-4">
      <StudentHeader />

      <h1 className="text-2xl font-bold mb-4">Teams at Your University</h1>

      <select
        value={selectedSport}
        onChange={(e) => setSelectedSport(e.target.value)}
        className="mb-6 px-4 py-2 border rounded"
      >
        <option value="">All Sports</option>
        {sports.map((sport) => (
          <option key={sport.id} value={sport.name}>
            {sport.name}
          </option>
        ))}
      </select>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <div key={team.id} className="border rounded-lg shadow p-4 bg-white">
              <h2 className="text-xl font-semibold mb-2">{team.name}</h2>
              <p className="text-sm text-gray-600 mb-2">Sport: {team.sport.name}</p>
              <p className="text-sm text-gray-600 mb-4">University: {team.university.name}</p>
              <button
                onClick={() => handleJoinRequest(team.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Request to Join
              </button>
            </div>
          ))}
        </div>
      )}

      {message && (
        <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 rounded">
          {message}
        </div>
      )}
    </div>
  );
}

export default FindTeam;
