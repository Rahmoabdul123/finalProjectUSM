import React from "react";
import LeagueFind from "../components/Leagues/LeagueFind";
import StudentHeader from "../components/studentHeader";
import AdminNavi from "../components/AdminNavi";
import Footer from "../components/Footer";

function AllLeagues() {
  const role = localStorage.getItem("role");

  return (
    <>
      {role === "Admin" ? <AdminNavi /> : <StudentHeader />}

      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 md:px-10">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md border p-6 sm:p-10">
          <LeagueFind />
        </div>
        
      </div>
      <Footer />
    </>
  );
}

export default AllLeagues;
