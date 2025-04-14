import { useState } from "react";
import { Link } from "react-router-dom";
import '../styles/tailwind.css';

const studentHeader = () => {
  return (
    <nav className="bg-blue-900 text-white px-6 py-4 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo Left */}
        <Link to="/student-dashboard">
          <img src="/images/logoFinalBlack-removebg.png" alt="USM Logo" className="w-32" />
        </Link>

        {/* Center Nav - Equal spacing */}
        <div className="flex-1 grid grid-cols-4 gap-8 text-center">
          
          {/* Team */}
          <div className="relative group inline-block">
            <div className="hover:text-gray-300 cursor-pointer">Team</div>
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-48 bg-white text-black rounded shadow-lg
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50 
              pointer-events-auto py-1">
              <Link to="/my-teams" className="block px-4 py-2 hover:bg-gray-100">My Teams</Link>
              <Link to="/join-team" className="block px-4 py-2 hover:bg-gray-100">Join a Team</Link>
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

          {/* Fixtures */}
          <div className="relative group inline-block">
            <div className="hover:text-gray-300 cursor-pointer">My Goals</div>
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-48 bg-white text-black rounded shadow-lg
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50 
              pointer-events-auto py-1">
              <Link to="/all-fixtures" className="block px-4 py-2 hover:bg-gray-100">All Fixtures</Link>
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

export default studentHeader;

