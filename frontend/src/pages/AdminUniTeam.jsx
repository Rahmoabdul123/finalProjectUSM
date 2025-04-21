import { useEffect } from "react";
import AdminNavi from "../components/AdminNavi";
import AdminTeams from "../components/AdminRole/AdminTeams";

/**
*This is a separate page accessed through the nav to find all of the teams 
* 
*/
function AdminUniTeam() {
  useEffect(() => {
    console.log("AdminDashboard loaded");
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavi />
      <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-4">University Teams</h1>
        <AdminTeams />
      </div>
    </div>
  );
}

export default AdminUniTeam;