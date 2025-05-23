import { useLocation } from "react-router-dom";
import { useState } from "react";
import TeamMates from "../components/students/TeamMates";
import TeamMatch from "../components/students/TeamMatch";
import MyLeagueStandings from "../components/Leagues/MyLeagueStandings";
import StudentHeader from "../components/studentHeader";
import UpdatePosition from "../components/students/UpdatePosition";
import TopScorers from "../components/students/TopScorers";
import Footer from "../components/Footer";
/**
 * Displays a homepage for a selected team.
 * has a vertical navigation containing different tabs to find team Members,matches,leagues and top scoreres
 */
function TeamHomepage() {
  const { state } = useLocation();
  const team = state?.team;
  const [section, setSection] = useState("members"); // Tracks which section is currently active

  if (!team) {
    return (
      <div className="p-8">
        <p className="text-red-600 font-semibold">
          Oops! No team information was found.
        </p>
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
                    ? "bg-green-600 text-white"
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
            <li>
              <button
                onClick={() => setSection("topScorers")}
                className={`w-full text-left px-4 py-2 rounded ${
                  section === "topScorers"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                Top Scorers
              </button>
          </li>


          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-50">
          <h1 className="text-3xl font-bold mb-6">Welcome to {team.name}!</h1>

          <img
            src="/images/logoFinal-removed-bg.png"
            alt="USM Logo"
            className="h-20 mb-6"
          />

          <p className="text-lg mb-6">
            You are now a member of the {team.sport.name} team at{" "}
            {team.university.name}.
          </p>
          {/* Dynamically Render Sections */}
          {section === "matches" && <TeamMatch teamId={team.id} />}
          {section === "league" && (
            <MyLeagueStandings
              teamId={team.id}
              leagueId={team.league.id}
              teamName={team.name}
            />
          )}
          {section === "members" && (
            <>
              <TeamMates teamId={team.id} />
              <UpdatePosition teamId={team.id} />
            </>
          )}
          {section === "topScorers" && (
          <TopScorers teamId={team.id} leagueId={team.league.id} />
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default TeamHomepage;


