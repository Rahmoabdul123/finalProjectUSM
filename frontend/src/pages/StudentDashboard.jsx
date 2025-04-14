import React from "react";
import StudentHeader from "../components/studentHeader";
import DirectTeam from "../components/DirectTeam";
import LeagueFind from   "../components/LeagueFind";
import MatchUpcoming from "../components/MatchUpcoming";

function StudentDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <StudentHeader />
      <div className="flex-1 p-6">
        <h1 className="text-4xl font-bold text-center mb-6">Welcome to the Student Dashboard</h1>
        <h3 className="text-2xl font-bold text-center mb-6"> </h3>
        <MatchUpcoming />
        <DirectTeam />
        <LeagueFind />
        
      </div>
    </div>
  );
}

export default StudentDashboard;





