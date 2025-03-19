import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [university, setUniversity] = useState("");
    const [universities, setUniversities] = useState([]);  // ✅ Store universities
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // ✅ Fetch universities when the component loads
        async function fetchUniversities() {
            try {
                const res = await api.get("/api/universities/");
                setUniversities(res.data);
            } catch (error) {
                console.error("Error fetching universities:", error);
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
                first_name: firstName,  // ✅ Send first & last name
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
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>

            {method === "register" && (
                <>
                    <input
                        className="form-input"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        required
                    />
                    <input
                        className="form-input"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        required
                    />
                </>
            )}

            <input
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />

            {method === "register" && (
                <select
                    className="form-input"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    required
                >
                    <option value="">Select a University</option>
                    {universities.map((uni) => (
                        <option key={uni.id} value={uni.id}>
                            {uni.name}
                        </option>
                    ))}
                </select>
            )}

            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">
                {name}
            </button>
        </form>
    );
}

export default Form;


