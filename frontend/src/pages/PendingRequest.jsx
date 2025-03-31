import { useEffect, useState } from "react";
import api from "../api";
import AdminHeader from "../components/AdminNavi";

function PendingRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/api/pending-join-requests/");
      setRequests(res.data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.post(`/api/handle-join-request/${id}/`, { action });
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
