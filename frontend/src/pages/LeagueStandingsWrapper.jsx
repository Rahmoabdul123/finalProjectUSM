import { useParams } from "react-router-dom";
import LeagueStandings from "../components/Leagues/LeagueStandings";

/**
 * Route-aware wrapper for the LeagueStandings component.
 */
const LeagueStandingsWrapper = () => {
  const { leagueId } = useParams();

  return <LeagueStandings leagueId={leagueId} />;
};

export default LeagueStandingsWrapper;

