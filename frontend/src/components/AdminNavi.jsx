import { Link } from "react-router-dom";
import '../styles/tailwind.css';

//  Code Inspired by Tailwind CSS v4 Full Course 2025 | Master Tailwind in One Hour, 
// Author :JavaScript Mastery
// , [https://www.youtube.com/watch?v=6biMWgD6_JY]
// This helped me with creating the tailwind on this page

//Tailwind used from https://www.creative-tim.com/twcomponents/cheatsheet
 // Author :Creative Tim
 //This also helped with creating the tailwind 
// This helped me with creating the tailwind on this page

function AdminNavi() {
  return (
    <nav className="bg-blue-900 text-white px-6 py-4 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo Left */}
        <Link to="/admin-dashboard">
          <img src="/images/logoFinalBlack-removebg.png" alt="USM Logo" className="w-32" />
        </Link>

        {/* Center Nav */}
        <div className="flex-1 grid grid-cols-4 gap-8 text-center text-sm sm:text-base font-semibold">
          
          {/* Team Requests */}
          <div className="relative group inline-block">
            <div className="cursor-pointer transition hover:text-gray-300 hover:underline">Team Requests</div>
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
            <div className="cursor-pointer transition hover:text-gray-300 hover:underline">League</div>
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-48 bg-white text-black rounded shadow-lg
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50 
              pointer-events-auto py-1">
              <Link to="/search-league" className="block px-4 py-2 hover:bg-gray-100">Search League</Link>
            </div>
          </div>

          {/* Team */}
          <div className="relative group inline-block">
            <div className="cursor-pointer transition hover:text-gray-300 hover:underline">Team</div>
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-48 bg-white text-black rounded shadow-lg
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50 
              pointer-events-auto py-1">
              <Link to="/admin-teams" className="block px-4 py-2 hover:bg-gray-100">View My University Teams</Link>
            </div>
          </div>

          {/* Profile */}
          <div className="relative group inline-block">
            <div className="cursor-pointer transition hover:text-gray-300 hover:underline">Profile</div>
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-48 bg-white text-black rounded shadow-lg
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50 
              pointer-events-auto py-1">
              <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
              <Link to="/logout" className="block px-4 py-2 hover:bg-gray-100">Logout</Link>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default AdminNavi;

