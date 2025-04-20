import { Navigate } from "react-router-dom";

// Helps with automatic Route redirection
//Used in App.jsx
function RedirectRole() {
    const userRole = localStorage.getItem("role"); 

    if (userRole === "Admin") {
        return <Navigate to="/admin-dashboard" />;
    } else if (userRole === "Student") {
        return <Navigate to="/student-dashboard" />;
    } else {
        return <Navigate to="/login" />;
    }
}

export default RedirectRole;
