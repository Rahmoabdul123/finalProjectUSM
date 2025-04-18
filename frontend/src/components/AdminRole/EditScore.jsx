import { useState } from "react";
import api from "../../api";

function EditScore({ match, onClose }) {
  const [homeScore, setHomeScore] = useState(match.home_score ?? "");
  const [awayScore, setAwayScore] = useState(match.away_score ?? "");
  const [date, setDate] = useState(match.date ?? "");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!homeScore && !awayScore && !date) {
      setError("Update one field at least");
      return;
    }

    const payload = {};

    if (date) payload.date = date;
    if (homeScore !== "") payload.home_score = parseInt(homeScore);
    if (awayScore !== "") payload.away_score = parseInt(awayScore);

    if (payload.home_score !== undefined && payload.away_score !== undefined) {
      payload.status = "Played";
    }

    try {
      await api.post(`/api/matches/${match.id}/edit-score/`, payload);

      setMessage("Match updated.");
      setError("");

      setTimeout(() => {
        setMessage("");
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Error saving match:", err);
      setError("Couldn't update match. Try again?");
    }
  };

  return (
    <div className="p-4 bg-gray-50 border rounded shadow max-w-md">
      <h2 className="text-xl font-bold mb-4">Edit Match</h2>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Home Score</label>
        <input
          type="number"
          value={homeScore}
          onChange={(e) => setHomeScore(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Away Score</label>
        <input
          type="number"
          value={awayScore}
          onChange={(e) => setAwayScore(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      {message && <p className="text-sm text-green-600 mb-2">{message}</p>}

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default EditScore;




