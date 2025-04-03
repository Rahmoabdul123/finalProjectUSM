import { useState } from "react";
import { Link } from "react-router-dom";
import '../styles/tailwind.css';


const StudentHeader = () => {
  return (
    <nav className="bg-blue-900 text-white px-6 py-3 shadow-md">
      <div className="flex items-center justify-between">
        <Link to="/student-dashboard" className="text-xl font-bold"><img src="/images/USMLogo.png" alt="USM Logo" className="w-60 mx-auto mb-4" /></Link>
        

        <div className="flex space-x-8">
          {/* Teams */}
          <div className="relative group">
            <button className="hover:text-gray-300">Teams</button>
            <div className="absolute left-0 top-full mt-2 w-40 rounded shadow-lg bg-white text-black 
                  invisible opacity-0 group-hover:visible group-hover:opacity-100 
                  transition-opacity duration-200 z-50">
              <Link to="/my-teams" className="block px-4 py-2 hover:bg-gray-100">My Teams</Link>
              <Link to="/join-team" className="block px-4 py-2 hover:bg-gray-100">Join a Team</Link>
            </div>
          </div>

          {/* League */}
          <div className="relative group">
            <button className="hover:text-gray-300">League</button>
            <div className="absolute left-0 hidden group-hover:block bg-white text-black mt-2 rounded shadow-lg w-48">
              <Link to="/my-league" className="block px-4 py-2 hover:bg-gray-100">My League</Link>
              <Link to="/search-league" className="block px-4 py-2 hover:bg-gray-100">Search League</Link>
            </div>
          </div>

          {/* Fixtures */}
          <div className="relative group">
            <button className="hover:text-gray-300">Fixtures</button>
            <div className="absolute left-0 hidden group-hover:block bg-white text-black mt-2 rounded shadow-lg w-48">
              <Link to="/all-fixtures" className="block px-4 py-2 hover:bg-gray-100">All Fixtures</Link>
              <Link to="/my-fixtures" className="block px-4 py-2 hover:bg-gray-100">My Fixtures</Link>
            </div>
          </div>

          <div className="relative group">
            <button className="hover:text-gray-300">Profile</button>
            <div className="absolute left-0 hidden group-hover:block bg-white text-black mt-2 rounded shadow-lg w-48">
              <Link to="/logout" className="block px-4 py-2 hover:bg-gray-100">Logout</Link>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default StudentHeader;
