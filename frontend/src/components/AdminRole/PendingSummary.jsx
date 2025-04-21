import { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../LoadingIndicator";

/**
 * A yellow notification showing the number of people who have requested to join a team
 */

function PendingSummary() {
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get("/api/pending-join-requests/");
        if (Array.isArray(res.data)) {
          setPendingCount(res.data.length);
        } else {
          console.warn("Unexpected response for join requests:", res.data);
        }
      } catch (err) {
        console.log("Could not fetch pending join requests", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <LoadingIndicator />;

  if (!pendingCount) return null;

  const requestText = pendingCount === 1 ? "request" : "requests";

  return (
    <div
      onClick={() => navigate("/pending-join-requests")}
      className="cursor-pointer bg-yellow-100 border border-yellow-400 p-4 rounded-lg shadow mb-6 hover:bg-yellow-200 transition"
    >
      <p className="font-semibold text-yellow-900">
        You have {pendingCount} pending join {requestText}. Click here to review.
      </p>
    </div>
  );
}

export default PendingSummary;

