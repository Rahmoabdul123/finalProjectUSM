import { useState, useEffect } from "react";
import api from "../../api";

//Changing password

function ProfilePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("first_name");
    if (storedName) {
      setFirstName(storedName);
    }
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const res = await api.post("/api/change-password/", {
        old_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setMessage(res.data.detail);
      setError("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const apiErrors = err.response?.data;
      if (apiErrors) {
        const allErrors = Object.values(apiErrors).flat().join(" ");
        setError(allErrors);
      } else {
        setError("Something went wrong.");
      }
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md border">
 
        <h2 className="text-2xl font-bold mb-6 text-blue-800 flex justify-center">
          Want to change your password?
        </h2>

        <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">
        </h1>

        <form onSubmit={handleChangePassword} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-100 px-4 py-2 rounded">
              {error}
            </p>
          )}
          {message && (
            <p className="text-green-600 text-sm bg-green-100 px-4 py-2 rounded">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-red-800 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePassword;