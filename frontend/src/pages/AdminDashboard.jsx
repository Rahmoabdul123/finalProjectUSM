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
      <div className="p-6">
        <h1 className="text-2xl font-bold">Welcome to the Admin Dashboard</h1>
      </div>
    </div>
  );
};


export default AdminDashboard;
