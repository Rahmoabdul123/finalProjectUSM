import { useState } from "react";
import { Link } from "react-router-dom";
import '../styles/tailwind.css';

const AdminNavi = () => {
  return (
    <nav className="bg-blue-900 text-white px-6 py-3 shadow-md">
      <div className="flex items-center justify-between">
        <Link to="/admin-dashboard" className="text-xl font-bold"><img src="/images/USMLogo.png" alt="USM Logo" className="w-60 mx-auto mb-4" /></Link>
        

        <div className="flex space-x-8">
          {/* Teams */}
          <div className="relative group">
            <button className="hover:text-gray-300">Team Requests</button>
            <div className="absolute left-0 top-full mt-2 w-40 rounded shadow-lg bg-white text-black 
                  invisible opacity-0 group-hover:visible group-hover:opacity-100 
                  transition-opacity duration-200 z-50">
              <Link to="/pending-join-requests" className="block px-4 py-2 hover:bg-gray-100">View Pending Requests</Link>
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
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavi;
