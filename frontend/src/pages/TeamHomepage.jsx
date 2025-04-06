import { useLocation } from "react-router-dom";
import { useState } from "react";
import TeamMembers from "../components/TeamMates";
import StudentHeader from "../components/studentHeader";

function TeamHomepage() {
  const { state } = useLocation();
  const team = state?.team;
  const [activeTab, setActiveTab] = useState("members"); 

  if (!team) return <p>I can't find any team information.</p>;

  return (
    <div className="flex min-h-screen">
      {/* <StudentHeader /> */}
      {/* Left sidebar nav */}
      <aside className="w-64 bg-gray-100 p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Team Menu</h2>
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => setActiveTab("members")}
              className={`w-full text-left px-4 py-2 rounded ${
                activeTab === "members" ? "bg-blue-600 text-white" : "hover:bg-gray-200"
              }`}
            >
               Team Members
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("matches")}
              className={`w-full text-left px-4 py-2 rounded ${
                activeTab === "matches" ? "bg-blue-600 text-white" : "hover:bg-gray-200"
              }`}
              disabled
            >
               Matches 
            </button>
          </li>
        </ul>
      </aside>

      {/* home page */}
      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6">Welcome to {team.name}!</h1>
        <img src="/images/USMLogo.png" alt="University Logo" className="h-20 mb-6" />
        <p className="text-lg mb-6">
          You are now a member of the {team.sport.name} team at {team.university.name}.
        </p>

        {/* Rendering the content of the selected tab */}
        {activeTab === "members" && <TeamMembers teamId={team.id} />}
      </main>
    </div>
  );
}

export default TeamHomepage;

