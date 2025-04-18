import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
//import "../styles/Form.css";
import '../styles/tailwind.css';

import LoadingIndicator from "./LoadingIndicator";
import { Link } from "react-router-dom";

function Form({ route, method }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [university, setUniversity] = useState("");
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUniversities() {
            try {
                const res = await api.get("/api/universities/");
                setUniversities(res.data);
            } catch (error) {
              console.log("Error fetching universities:", error);
            }
        }
        fetchUniversities();
    }, []);

    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const payload = {
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                university
            };

            const res = await api.post(route, payload);

            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                localStorage.setItem("role", res.data.role);
                localStorage.setItem("university", res.data.university);
                localStorage.setItem("first_name", res.data.first_name);
                localStorage.setItem("last_name", res.data.last_name);

                if (res.data.role === "Admin") {
                    navigate("/admin-dashboard");
                } else {
                    navigate("/student-dashboard");
                }
            } else {
                navigate("/login");
            }
        } catch (error) {
            alert("Something went wrong. Please try again.");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
      <div className="flex h-screen">
        {/* Left side - Form */}
        <div className="flex flex-1 justify-center items-center bg-white">
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-12 py-10 w-full max-w-md">
            <img src="/images/logoFinal.png" alt="USM Logo" className="w-32 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-center mb-4">{name}</h1>
  
            {method === "register" && (
              <>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  required
                />
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  required
                />
              </>
            )}
  
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
  
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
  
            {method === "register" && (
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                required
              >
                <option value="">Select a University</option>
                {universities.map((uni) => (
                  <option key={uni.id} value={uni.id}>{uni.name}</option>
                ))}
              </select>
            )}
  
            {loading && <LoadingIndicator />}
  
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
              type="submit"
            >
              {name}
            </button>
  
            <p className="mt-4 text-sm text-center">
              {method === "login" ? (
                <>Don’t have an account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link></>
              ) : (
                <>Have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link></>
              )}
            </p>
          </form>
        </div>
  
        {/* Right side - Image */}
        <div className="flex flex-1 items-center justify-center bg-gray-100">
          <img src="/images/hockeyGirl.png" alt="Hockey" className="w-full h-full object-cover" />
        </div>
      </div>
      
      
    );
}

export default Form;




