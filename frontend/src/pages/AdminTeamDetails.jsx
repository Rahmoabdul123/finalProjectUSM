import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminNavi from "../components/AdminNavi";
import AdminTeamMembers from "./AdminTeamMembers";
import AdminTeamFixtures from "./AdminTeamFixtures";

/**
 * Admin view:Main page with two tabs navigating to either the members tab or fixtures tab
 */

function AdminTeamDetails() {
  const { teamId } = useParams();
  const [activeTab, setActiveTab] = useState("members"); // "members" or "fixtures"

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavi />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Team Management</h1>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("members")}
            className={`px-4 py-2 rounded ${activeTab === "members" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Team Members
          </button>
          <button
            onClick={() => setActiveTab("fixtures")}
            className={`px-4 py-2 rounded ${activeTab === "fixtures" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Fixtures
          </button>
        </div>

        {activeTab === "members" ? (
          <AdminTeamMembers />
        ) : (
          <AdminTeamFixtures />
        )}
      </div>
    </div>
  );
}

export default AdminTeamDetails;
