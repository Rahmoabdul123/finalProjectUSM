import { useEffect } from "react";
import AdminNavi from "../components/AdminNavi";
import AdminUniversityTeams from "../components/AdminTeams";

function AdminUniTeam() {
  useEffect(() => {
    console.log("AdminDashboard loaded");
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavi />
      <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-4">University Teams</h1>
        <AdminUniversityTeams />
      </div>
    </div>
  );
}

export default AdminUniTeam;