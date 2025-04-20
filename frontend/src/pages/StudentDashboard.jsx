import React from "react";
import StudentHeader from "../components/studentHeader";
import Footer from "../components/Footer";
import { Smile, Trophy, Users, CalendarDays } from "lucide-react";

import DirectTeam from "../components/DirectTeam";
import LeagueFind from "../components/Leagues/LeagueFind";
import MatchUpcoming from "../components/MatchUpcoming";
// Main Student dashboard containing quick access to teams and Leagues as well as Upcoming Matches
function StudentDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <StudentHeader />

      {/* Hero Title */}
      <div className="text-center py-6 px-4 sm:px-6 lg:px-20">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-2">
          Your True University Experience Starts here 🏅
        </h1>
        <p className="text-gray-600 text-lg">
           Have Fun! Make unforgettable Memories!
        </p>
      </div>

      <div className="flex-1 px-4 sm:px-6 lg:px-20 py-4">
        {/* MatchUpcoming section */}
        <div className="flex justify-center mb-10">
          <MatchUpcoming />
        </div>

        {/* Two-column section: Team image & quick access */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left: Big Image */}
          <div className="lg:col-span-2">
            <img
              src="/images/TeamsPic.jpg"
              alt="Team Sport"
              className="w-full h-[400px] sm:h-[500px] object-cover rounded-xl shadow-lg"
            />
          </div>

          {/* Right: Direct Team Access */}
          <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition">
            <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2 mb-4">
              <Users className="w-6 h-6 text-blue-600" />Teams
            </h2>
            <DirectTeam />
          </div>
        </div>

        {/* League Explorer section with flipped order */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left: League Cards */}
          <div className="lg:col-span-2 order-2 lg:order-1 bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition">
            <LeagueFind />
          </div>

          {/* Right: Trophy Image */}
          <div className="order-1 lg:order-2">
            <img
              src="/images/Trophy.jpg"
              alt="Trophy Showcase"
              className="w-full h-[400px] sm:h-[500px] object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default StudentDashboard;









