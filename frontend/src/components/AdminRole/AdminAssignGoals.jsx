import { useEffect, useState } from "react";
import api from "../../api";

/**
 * Page that allows admin to assign goals
 */

function AdminAssignGoals({ matchId, teamId, onClose }) {
  const [players, setPlayers] = useState([]);
  const [goals, setGoals] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await api.get(`/api/admin/teams/${teamId}/members/`);
        setPlayers(res.data);

        // setup default goals
        const g = {};
        res.data.forEach((p) => {
          g[p.id] = 0;
        });
        setGoals(g);
      } catch (err) {
        console.log("Couldn't load players", err);
      }
    };

    fetchPlayers();
  }, [teamId]);

  const handleInputChange = (userId, value) => {
    setGoals((prev) => ({
      ...prev,
      [userId]: parseInt(value) || 0,
    }));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const payload = Object.entries(goals)
        .filter(([_, g]) => g > 0)
        .map(([user_id, goals]) => ({
          user_id,
          team_id: teamId,
          goals,
        }));

      console.log("Submitting goal payload", payload); //  debug

      await api.post(`/api/admin/matches/${matchId}/assign-goals/`, payload);

      alert("Saved!");
      onClose();
    } catch (err) {
      console.log("Save error", err);
      alert("Something went wrong...");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Assign Goals</h2>

      {players.map((p) => (
        <div key={p.id} className="mb-3">
          <label className="block font-medium">{p.name}</label>
          <input
            type="number"
            min="0"
            value={goals[p.id]}
            onChange={(e) => handleInputChange(p.id, e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      ))}

      <div className="mt-4 flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default AdminAssignGoals;

