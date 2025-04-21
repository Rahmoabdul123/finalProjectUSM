import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
//import "../styles/Form.css";
import '../styles/tailwind.css';
import { Toaster, toast } from 'react-hot-toast';

import LoadingIndicator from "./LoadingIndicator";
import { Link } from "react-router-dom";

//  Code inspired and reused from: [Django & React Web App Tutorial - Authentication, Databases, Deployment & More], 
// Author :[Tech with Team]
// , [https://www.youtube.com/watch?v=c-QsfbznSXI]
// I adapted from the video to create the login page

//  Code Inspired by Tailwind CSS v4 Full Course 2025 | Master Tailwind in One Hour, 
// Author :JavaScript Mastery
// , [https://www.youtube.com/watch?v=6biMWgD6_JY]
// This helped me with creating the tailwind on this page

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
            if (error.response) {
                const data = error.response.data;
    
                if (data.detail) {
                    toast.error(data.detail);
                } else if (data.email) {
                    toast.error(data.email[0]);
                } else {
                    toast.error("Something went wrong. Please check your input and try again.");
                }
            } else {
                toast.error("Something went wrong. Please try again.");
            }
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
      <div className="flex h-screen">
        <>
          <Toaster position="top-center" reverseOrder={false} />  
          <div className="flex h-screen">
            {/*  form content */}
          </div>
        </>
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
            <h3 className="text-1xl  text-center mb-4">Passwords require at least 8 characters,one Uppercase and one number </h3>
  
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
          <img src="/images/hockeyUSM.jpg" alt="Hockey" className="w-full h-full object-cover" />
          {/* Image Source: https://www.pexels.com/search/hockey/ */}
        </div>
      </div>
      
      
    );
}

export default Form;




