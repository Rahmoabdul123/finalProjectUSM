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
    console.log(" useEffect triggered!");
    fetchRequests();
  }, []);

  // Function to fetch pending join requests from the backend
  const fetchRequests = async () => {
    console.log(" fetching api");
    try {
      const res = await api.get("/api/pending-join-requests/");
      console.log(" response received", res.data);
      setRequests(res.data);
    } catch (error) {
      console.error(" error fetch", error);
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
      console.error("Action failed", error);
    }
  };
  

  return (
    <div className="p-4">
      <AdminHeader />
      <h1 className="text-2xl font-bold mb-4">Pending Join Requests</h1>
      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No pending requests</p>
        //  displays the list of requests
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((req) => (
            <div key={req.id} className="border rounded-lg p-4 shadow bg-white">
              <p className="font-semibold">{req.user_full_name}</p>
              <p className="text-gray-700 text-sm mb-2">Requesting to join: {req.team_name}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(req.id, "Approve")}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(req.id, "Reject")}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PendingRequest;
