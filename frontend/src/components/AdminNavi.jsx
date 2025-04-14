import { useState } from "react";
import { Link } from "react-router-dom";
import '../styles/tailwind.css';

const AdminNavi = () => {
  return (
    <nav className="bg-blue-900 text-white px-6 py-4 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo Left */}
        <Link to="/admin-dashboard">
          <img src="/images/logoFinalBlack-removebg.png" alt="USM Logo" className="w-32" />
        </Link>

        {/* Center Nav - Equal spacing */}
        <div className="flex-1 grid grid-cols-4 gap-8 text-center">
          
          {/* Team Requests */}
          <div className="relative group inline-block">
            <div className="hover:text-gray-300 cursor-pointer">Team Requests</div>
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-48 bg-white text-black rounded shadow-lg
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50 
              pointer-events-auto py-1">
              <Link to="/pending-join-requests" className="block px-4 py-2 hover:bg-gray-100">
                View Pending Requests
              </Link>
            </div>
          </div>

          {/* League */}
          <div className="relative group inline-block">
            <div className="hover:text-gray-300 cursor-pointer">League</div>
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-48 bg-white text-black rounded shadow-lg
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50 
              pointer-events-auto py-1">
              <Link to="/search-league" className="block px-4 py-2 hover:bg-gray-100">Search League</Link>
            </div>
          </div>

          {/* Teams */}
          <div className="relative group inline-block">
            <div className="hover:text-gray-300 cursor-pointer">Team Matches </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-48 bg-white text-black rounded shadow-lg
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50 
              pointer-events-auto py-1">
              <Link to="/admin-teams" className="block px-4 py-2 hover:bg-gray-100">View My University Teams</Link>
            </div>
          </div>

          {/* Profile */}
          <div className="relative group inline-block">
            <div className="hover:text-gray-300 cursor-pointer">Profile</div>
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-48 bg-white text-black rounded shadow-lg
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50 
              pointer-events-auto py-1">
              <Link to="/logout" className="block px-4 py-2 hover:bg-gray-100">Logout</Link>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default AdminNavi;
