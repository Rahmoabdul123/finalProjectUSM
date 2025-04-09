import { useParams } from "react-router-dom";
import LeagueStandings from "../components/LeagueStandings";

/**
 * Route-aware wrapper for the LeagueStandings component.
 */
const LeagueStandingsWrapper = () => {
  const { leagueId } = useParams();

  // Pass the extracted ID to the core LeagueStandings component
  return <LeagueStandings leagueId={leagueId} />;
};

export default LeagueStandingsWrapper;

