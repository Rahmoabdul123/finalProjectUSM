import { useLocation } from "react-router-dom";
import { useState } from "react";
import TeamMates from "../components/TeamMates";
import TeamMatch from "../components/TeamMatch";
import MyLeagueStandings from "../components/MyLeagueStandings";
import StudentHeader from "../components/studentHeader"; // Optional: Can be re-enabled later

/**
 * Displays a homepage for a selected team.
 * Includes navigation to view team members, match schedule, and league standings.
 */
function TeamHomepage() {
  const { state } = useLocation();
  const team = state?.team;
  const [section, setSection] = useState("members"); // Tracks which section is currently active

  // Show fallback UI if no team is passed in navigation state
  if (!team) {
    return (
      <div className="p-8">
        <p className="text-red-600 font-semibold">
          Oops! No team information was found.
        </p>
        {/* TODO: Consider redirecting to dashboard or showing a link to return */}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Nav */}
      <StudentHeader />

      {/* Main content: Sidebar + Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Team Menu</h2>
          <ul className="space-y-3">
            <li>
              <button
                onClick={() => setSection("members")}
                className={`w-full text-left px-4 py-2 rounded ${
                  section === "members"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                Team Members
              </button>
            </li>
            <li>
              <button
                onClick={() => setSection("matches")}
                className={`w-full text-left px-4 py-2 rounded ${
                  section === "matches"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                Matches
              </button>
            </li>
            <li>
              <button
                onClick={() => setSection("league")}
                className={`w-full text-left px-4 py-2 rounded ${
                  section === "league"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                League
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-50">
          <h1 className="text-3xl font-bold mb-6">Welcome to {team.name}!</h1>

          <img
            src="/images/USMLogo.png"
            alt="University Logo"
            className="h-20 mb-6"
          />

          <p className="text-lg mb-6">
            You are now a member of the {team.sport.name} team at{" "}
            {team.university.name}.
          </p>

          {section === "members" && <TeamMates teamId={team.id} />}
          {section === "matches" && <TeamMatch teamId={team.id} />}
          {section === "league" && (
            <MyLeagueStandings
              teamId={team.id}
              leagueId={team.league.id}
              teamName={team.name}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default TeamHomepage;


