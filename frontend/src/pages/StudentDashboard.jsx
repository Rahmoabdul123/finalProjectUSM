import React from "react";
import StudentHeader from "../components/studentHeader";
import DirectTeam from "../components/DirectTeam";

function StudentDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <StudentHeader />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Welcome to the Student Dashboard</h1>
        <DirectTeam />
      </div>
    </div>
  );
}

export default StudentDashboard;





