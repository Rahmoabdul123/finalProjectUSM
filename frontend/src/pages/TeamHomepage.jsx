import { useLocation } from "react-router-dom";
import { useState } from "react";
import TeamMembers from "../components/TeamMates";
import StudentHeader from "../components/studentHeader"; // Might reintroduce later

function TeamHomepage() {
  const { state } = useLocation();
  const team = state?.team;
  const [section, setSection] = useState("members"); // 'section' fits the domain better

  if (!team) {
    return (
      <div className="p-8">
        <p className="text-red-600 font-semibold">Oops! No team information was found.</p>
        {/* TODO: Maybe redirect to dashboard or show a retry option, will look into later */}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* <StudentHeader /> */}
      {/* Left sidebar nav */}
      <aside className="w-64 bg-gray-100 p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Team Menu</h2>
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => setSection("members")}
              className={`w-full text-left px-4 py-2 rounded ${
                section === "members" ? "bg-blue-600 text-white" : "hover:bg-gray-200"
              }`}
            >
               Team Members
            </button>
          </li>
          <li>
            <button
              onClick={() => setSection("matches")}
              className={`w-full text-left px-4 py-2 rounded ${
                section === "matches" ? "bg-blue-600 text-white" : "hover:bg-gray-200"
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

        {section === "members" && <TeamMembers teamId={team.id} />}
      </main>
    </div>
  );
}

export default TeamHomepage;

