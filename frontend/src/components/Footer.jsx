import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-12 shadow-inner ">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-lg font-semibold mb-3">
          University Sports Management App
        </h2>

        <ul className="flex justify-center flex-wrap gap-6 text-sm text-gray-400 mb-3">
          <li><Link to="/student-dashboard" className="hover:text-white">Dashboard</Link></li>
          <li><Link to="/leagues" className="hover:text-white">Leagues</Link></li>
          <li><Link to="/find-team" className="hover:text-white">Teams</Link></li>
          <li><Link to="/fixtures" className="hover:text-white">Fixtures</Link></li>
        </ul>

        <p className="text-sm text-gray-400">
        Your True University Experience Starts here!
        </p>
        <p className="text-xs text-gray-500 mt-2">
           {new Date().getFullYear()} University Sports Management USM 2025
        </p>
      </div>
    </footer>
  );
}

export default Footer;
