import { Link } from "react-router-dom";

function AdminNavi() {
  return (
    <>
      <AdminNavi /> {}
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Welcome Admin!</h1>
        <p className="mb-6">This is your admin dashboard.</p>

        <div className="space-y-4">
          <Link
            to="/pending-join-requests"
            className="block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-center w-fit"
          >
            View Join Requests
          </Link>
        </div>
      </div>
    </>
  );
}

export default AdminNavi;
