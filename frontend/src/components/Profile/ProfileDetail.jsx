import { useState, useEffect } from "react";
import api from "../../api";

//Profile

function ProfileDetail() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setFirstName(localStorage.getItem("first_name") || "");
    setLastName(localStorage.getItem("last_name") || "");
    setEmail(localStorage.getItem("email") || "");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/update-details/", {
        first_name: firstName,
        last_name: lastName,
        email: email
      });

      localStorage.setItem("first_name", firstName);
      localStorage.setItem("last_name", lastName);
      localStorage.setItem("email", email);

      setMessage(res.data.detail);
      setError("");
    } catch (err) {
      const apiErrors = err.response?.data;
      if (apiErrors) {
        const allErrors = Object.values(apiErrors).flat().join(" ");
        setError(allErrors);
      } else {
        setError("error!");
      }
      setMessage("");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md border">
        <h2 className="text-2xl font-bold mb-6 text-blue-800 flex justify-center">
          Please check your details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">First Name</label>
            <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            />
        </div>

        <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Last Name</label>
            <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            />
        </div>

        <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Email</label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {message && <p className="text-green-600 text-sm">{message}</p>}

        <button type="submit" className="w-full bg-red-800 font-semibold text-white py-2 rounded-lg hover:bg-blue-700">
            Save Changes
        </button>
        </form>
    </div>
  );
}

export default ProfileDetail;
