import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import StudentHeader from "../components/studentHeader";
import LoadingIndicator from "../components/LoadingIndicator";
import { getSportLogo } from "../components/SportsLogoIcon";
import Footer from "../components/Footer";

function FindTeam() {
  const [teams, setTeams] = useState([]);
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

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
      console.log("Error fetching teams", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSports = async () => {
    try {
      const response = await api.get("/api/sports/");
      setSports(response.data);
    } catch (error) {
      console.log("Error fetching sports", error);
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
  <div className="flex flex-col min-h-screen bg-gray-50">
    <StudentHeader />

    <main className="flex-1 px-4 py-8 sm:px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Teams at Your University
        </h1>

        {/* Filter Dropdown */}
        <div className="mb-6">
          <label htmlFor="sportFilter" className="sr-only">Filter by sport</label>
          <select
            id="sportFilter"
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="w-full max-w-xs p-2 border border-gray-300 rounded-lg text-gray-700 focus:ring focus:ring-blue-300"
          >
            <option value="">All Sports</option>
            {sports.map((sport) => (
              <option key={sport.id} value={sport.name}>
                {sport.name}
              </option>
            ))}
          </select>
        </div>

        {/* Loading */}
        {loading ? (
          <LoadingIndicator />
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col justify-between"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={getSportLogo(team.sport?.name)}
                    alt={`${team.sport?.name} logo`}
                    className="w-14 h-14 rounded-full border object-contain"
                  />
                  <h2 className="text-lg font-bold text-gray-800">
                    {team.name}
                  </h2>
                </div>

                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <p><span className="font-medium">Sport:</span> {team.sport?.name || "N/A"}</p>
                  <p><span className="font-medium">University:</span> {team.university?.name || "N/A"}</p>
                </div>

                <button
                  onClick={() => handleJoinRequest(team.id)}
                  className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Request to Join
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Feedback message */}
        {message && (
          <div className="mt-6 p-4 rounded-lg bg-yellow-100 text-yellow-800 text-center text-sm font-medium shadow">
            {message}
          </div>
        )}
      </div>
    </main>
    <Footer />
  </div>
);
}

export default FindTeam;

