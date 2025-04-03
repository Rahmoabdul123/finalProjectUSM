import { useLocation } from "react-router-dom";

function TeamHomepage() {
  const { state } = useLocation();
  const team = state?.team;

  if (!team) return <p>No team information found.</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to {team.name}!</h1>
      <img src="/images/USMLogo.png" alt="University Logo" className="h-20 mb-4" />
      <p className="text-lg">You are now a member of the {team.sport.name} team at {team.university.name}.</p>
    </div>
  );
}

export default TeamHomepage;
