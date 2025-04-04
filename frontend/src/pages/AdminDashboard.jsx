import { Link } from "react-router-dom";
import { useEffect } from "react";
import AdminNavi from "../components/AdminNavi";

function AdminDashboard() {
  useEffect(() => {
    console.log("AdminDashboard loaded");
  }, []);

  return (
    <div>
      <AdminNavi />
      <div className="w-full text-center mt-6">
        <h1 className="text-4xl font-bold">Welcome to the Admin Dashboard</h1>
      </div>
    </div>
  );
};


export default AdminDashboard;
