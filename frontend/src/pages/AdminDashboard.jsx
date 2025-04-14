import { useEffect } from "react";
import AdminNavi from "../components/AdminNavi";
import AdminTeams from "../components/AdminTeams";
import PendingSummary from "../components/PendingSummary";
import LeagueFind from   "../components/LeagueFind";
 // add this

function AdminDashboard() {
  useEffect(() => {
    console.log("AdminDashboard loaded");
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavi />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome to the Admin Dashboard</h1>
        <PendingSummary />

        {/* <MainLeagueList /> */}
      
        <AdminTeams />
        <LeagueFind />
      </div>
    </div>
  );
}

export default AdminDashboard;

