import { useEffect } from "react";
import AdminNavi from "../components/AdminNavi";
import AdminTeams from "../components/AdminRole/AdminTeams";
import PendingSummary from "../components/AdminRole/PendingSummary";
import LeagueFind from   "../components/Leagues/LeagueFind";
import { Users } from "lucide-react";
import Footer from "../components/Footer";

 
// Main dashboard page for Admin users to view pending requests, manage teams, and explore leagues.

function AdminDashboard() {
  // useEffect(() => {
  //   console.log("AdminDashboard loaded");
  // }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavi />
      <div className="flex-1 p-6">
        <div className="text-center py-6 px-4 sm:px-6 lg:px-20">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">
          Welcome to the Admin Dashboard 🏅
          </h1>
          <p className="text-gray-600 text-lg">
            Managing Matches has never been SOO easy!
          </p>
        </div>
        
        <PendingSummary />

        {/* To make teh picture to the left and access to all team to right */}
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
          <div className="bg-white  rounded-xl p-4 shadow-md hover:shadow-lg transition">
            <h2 className="flex items-center gap-2 mb-4 text-2xl text-blue-800 font-bold  ">
              <Users className="w-6 h-6 text-blue-600" /> All Teams
            </h2>
            <AdminTeams />
          </div>
        </div>
        <LeagueFind />
      </div>
      <Footer />
    </div>
  );
}

export default AdminDashboard;

