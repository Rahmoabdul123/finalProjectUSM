import { Navigate } from "react-router-dom";

function RedirectRole() {
    const userRole = localStorage.getItem("userRole");

    if (userRole === "Admin") {
        return <Navigate to="/admin-dashboard" />;
    } else if (userRole === "Student") {
        return <Navigate to="/student-dashboard" />;
    } else {
        return <Navigate to="/login" />;
    }
}

export default RedirectRole;
