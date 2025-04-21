import { Link } from "react-router-dom";




// This is the footer
function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-12 shadow-inner ">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-lg font-semibold mb-3">
          University Sports Management App
        </h2>
        <p className="text-sm text-gray-400">
        Your True University Experience Starts here!
        </p>
        <p className="text-xs text-gray-500 mt-2">
           {new Date().getFullYear()} University Sports Management USM
        </p>
      </div>
    </footer>
  );
}

export default Footer;
