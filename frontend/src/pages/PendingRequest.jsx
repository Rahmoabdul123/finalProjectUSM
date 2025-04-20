import { useEffect, useState } from "react";
import api from "../api";
import AdminHeader from "../components/AdminNavi";
import { useNavigate } from "react-router-dom";

function PendingRequest() {
  console.log(" PendingRequest loaded");
  // handles the list of join requests
  const [requests, setRequests] = useState([]);
  // handles loading spinner/feedback
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  // useEffect used to fetch pending join requests
  useEffect(() => {
    fetchRequests();
  }, []);

  // Function to fetch pending join requests from the backend
  const fetchRequests = async () => {
    try {
      const res = await api.get("/api/pending-join-requests/");
      setRequests(res.data);
    } catch (error) {
      console.error("Failed to fetch pending requests", error);
    } finally {
      setLoading(false);
    }
  };
  
// Handles approval or rejection of a request
  const handleAction = async (id, action) => {
    try {
      await api.post(`/api/handle-request/${id}/`, { action });
  
      // Refresh the list after approval or rejection
      fetchRequests();
    } catch (error) {
      console.log("Action failed", error);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Pending Join Requests</h1>
  
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-600 italic">No pending requests at the moment.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-gray-200 rounded-xl shadow-md p-6 flex flex-col justify-between"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold text-xl">
                    {req.user_full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{req.user_full_name}</p>
                    <p className="text-sm text-gray-600">Wants to join: <span className="font-medium">{req.team_name}</span></p>
                  </div>
                </div>
  
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleAction(req.id, "Approve")}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(req.id, "Reject")}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PendingRequest;
