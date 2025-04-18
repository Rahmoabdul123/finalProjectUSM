import { useEffect, useState } from "react";
import api from "../../api";

function UpdatePosition({ teamId }) {
  const [position, setPosition] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const res = await api.get(`/api/teams/${teamId}/members/`);
        const self = res.data.find((m) => m.is_self);
        if (self) {
          setPosition(self.position || "");
        } else {
          console.log("No current user in team list?");
        }
      } catch (err) {
        console.log("Error loading position:", err);
      }
    };

    fetchPosition();
  }, [teamId]);

  const handleSave = async () => {
    if (!position) {
      setFeedback("Position can't be empty");
      return;
    }

    setSaving(true);

    try {
      await api.post(`/api/teams/${teamId}/update-position/`, { position });
      setFeedback("Saved");
    } catch (err) {
      console.warn("Update failed", err);
      setFeedback("Failed to save position.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Your Position</h2>

      <input
        type="text"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        className="border p-2 rounded w-full max-w-sm"
        placeholder="e.g. Forward"
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {saving ? "Saving..." : "Save Position"}
      </button>

      {feedback && (
        <p className="mt-2 text-sm text-gray-700">{feedback}</p>
      )}
    </div>
  );
}

export default UpdatePosition;

