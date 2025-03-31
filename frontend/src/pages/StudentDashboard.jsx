import React from "react";
import StudentHeader from "../components/studentHeader";

const StudentDashboard = () => {
    return (
      <div>
        <StudentHeader />
        <div className="p-6">
          <h1 className="text-2xl font-bold">Welcome to the Student Dashboard</h1>
        </div>
      </div>
    );
  };
  
  export default StudentDashboard;
