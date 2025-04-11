import { useState } from "react";
import api from "../api";

/**
 * A small form component for editing the score and date of a match.
 */
function EditScore({ match, onClose }) {
  const [homeScore, setHomeScore] = useState(match.home_score ?? "");
  const [awayScore, setAwayScore] = useState(match.away_score ?? "");
  const [date, setDate] = useState(match.date ?? "");

  const [message, setMessage] = useState(""); // Success confirmation
  const [error, setError] = useState("");     // Error feedback

  // Handle saving updated match data to the backend
  const handleSave = async () => {
    // Basic front-end validation
    if (homeScore === "" || awayScore === "" || date === "") {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await api.post(`/api/matches/${match.id}/edit-score/`, {
        home_score: homeScore,
        away_score: awayScore,
        date: date,
      });

      setMessage("Match updated successfully.");
      setError("");

      // Optional delay to show success message before closing
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 1500);
    } catch (err) {
      setError("Failed to update match. Please try again.");
    }
  };

  return (
    <div className="p-4 border rounded bg-gray-50 shadow max-w-md">
      <h2 className="text-xl font-bold mb-4">Edit Match Details</h2>

      {/* Match date input */}
      <div className="mb-3">
        <label className="block text-sm font-semibold mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Home score input */}
      <div className="mb-3">
        <label className="block text-sm font-semibold mb-1">Home Score</label>
        <input
          type="number"
          value={homeScore}
          onChange={(e) => setHomeScore(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Away score input */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Away Score</label>
        <input
          type="number"
          value={awayScore}
          onChange={(e) => setAwayScore(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Conditional feedback messages */}
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      {message && <p className="text-green-600 text-sm mb-2">{message}</p>}

      {/* Form action buttons */}
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default EditScore;

