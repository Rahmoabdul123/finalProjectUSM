import React from "react";
import StudentHeader from "../components/studentHeader";
import Footer from "../components/Footer";
import { Users, CalendarClock, AlertCircle } from "lucide-react"; // added icons
import DirectTeam from "../components/DirectTeam";
import LeagueFind from "../components/Leagues/LeagueFind";
import MatchUpcoming from "../components/MatchUpcoming";


// This is the main student dashboard containing , the upcoming matches,extra info, leagues as well as Qucik access to Teams
function StudentDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <StudentHeader />


      <div className="text-center py-6 px-4 sm:px-6 lg:px-20">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-2">
          Your True University Experience Starts here 🏅
        </h1>
        <p className="text-gray-600 text-lg">
          Have Fun! Make unforgettable Memories!
        </p>
      </div>

      <div className="flex-1 px-4 sm:px-6 lg:px-20 py-4">
        {/* Upcoming Match section with reminders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center mb-12">
          
          {/* Left: Reminder to mark availability */}
          <div className="bg-white p-4 rounded-xl shadow-md text-center hover:shadow-lg transition">
            <h2 className="text-lg font-bold text-blue-800 flex justify-center items-center gap-2 mb-2">
              <CalendarClock className="w-5 h-5 text-blue-600" />
              Mark Your Availability
            </h2>
            <p className="text-gray-600 text-m">
              Let your team know if you’ll be attending the match! 
            </p>
          </div>

          {/* Center: Upcoming Match */}
          <div className="col-span-1 flex justify-center">
            <MatchUpcoming />
          </div>

          {/* Right: Quick Access Info */}
          <div className="bg-white p-4 rounded-xl shadow-md text-center hover:shadow-lg transition">
            <h2 className="text-lg font-bold text-blue-800 flex justify-center items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              Quick Access Info
            </h2>
            <p className="text-gray-600 text-m">
              If you don't see your team, your join request is still pending approval or has been rejected. 
            </p>
            <p className="text-gray-600 text-m">
              Please contact student union if you have any questions. 
            </p>
          </div>
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
              <Users className="w-6 h-6 text-blue-600" />
              Teams
            </h2>
            <DirectTeam />
          </div>
        </div>


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









