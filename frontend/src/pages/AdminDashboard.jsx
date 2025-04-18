import { useEffect } from "react";
import AdminNavi from "../components/AdminNavi";
import AdminTeams from "../components/AdminRole/AdminTeams";
import PendingSummary from "../components/AdminRole/PendingSummary";
import LeagueFind from   "../components/Leagues/LeagueFind";
import { Users } from "lucide-react";

 

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start px-6 py-8">
          {/* Left: Big Image */}
          <div className="lg:col-span-2 h-full">
            <img
              src="/images/Admin.jpg"
              alt="Someone looking through files"
              className="w-full h-[400px] object-cover rounded-xl shadow"
            />
          </div>

          {/* Right: Direct Team Access */}
          <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition">
            <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2 mb-4">
              <Users className="w-6 h-6 text-blue-600" /> All Teams
            </h2>
            <AdminTeams />
          </div>
        </div>
        <LeagueFind />
      </div>
    </div>
  );
}

export default AdminDashboard;

