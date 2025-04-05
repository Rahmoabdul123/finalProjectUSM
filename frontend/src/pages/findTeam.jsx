import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import StudentHeader from "../components/studentHeader";

function FindTeam() {
  // State to store all teams at the user's university
  const [teams, setTeams] = useState([]);
  // State to store list of all available sports for filtering
  const [sports, setSports] = useState([]);
  // State to track the currently selected sport filter
  const [selectedSport, setSelectedSport] = useState("");
  
  // Boolean state to manage loading indicator
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Message feedback
  const [message, setMessage] = useState("");

 // Load both sports and teams whenever selectedSport changes
  useEffect(() => {
    fetchTeams();
    fetchSports();
  }, [selectedSport]);

  // Fetch teams at the user's university, filtered by sport if selected
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
// Fetch all sports to populate the dropdown filter
  const fetchSports = async () => {
    try {
      const response = await api.get("/api/sports/");
      setSports(response.data);
    } catch (error) {
      console.error("Error fetching sports", error);
    }
  };

// Send join request to the backend when user clicks "Request to Join"
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
      {/* Dropdown to filter teams by sport */}
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
      {/* Show loading spinner or team cards */}
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
      {/* Message area for success or failure */}
      {message && (
        <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 rounded">
          {message}
        </div>
      )}
    </div>
  );
}

export default FindTeam;
