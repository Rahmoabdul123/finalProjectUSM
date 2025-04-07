from api.models import LeagueTable, Match, Team
from django.utils import timezone
import random
from datetime import timedelta

def run():
    all_leagues = LeagueTable.objects.all()
    total_matches_created = 0

    for league in all_leagues:
        teams = list(league.teams.all())

        if len(teams) < 2:
            print(f" Skipping league '{league.name}' (not enough teams)")
            continue

        print(f" Generating matches for: {league.name}")

        for i in range(len(teams)):
            for j in range(len(teams)):
                if i != j:
                    home_team = teams[i]
                    away_team = teams[j]

                    # Avoid creating duplicate matches
                    if Match.objects.filter(home_team=home_team, away_team=away_team, league=league).exists():
                        continue

                    if random.random() < 0.7:
                        # Past match
                        match_date = timezone.now().date() - timedelta(days=random.randint(7, 30))
                        home_score = random.randint(0, 5)
                        away_score = random.randint(0, 5)
                        status = "Played"
                    else:
                        # Future match
                        match_date = timezone.now().date() + timedelta(days=random.randint(1, 14))
                        home_score = None
                        away_score = None
                        status = "Pending"

                    match = Match.objects.create(
                        home_team=home_team,
                        away_team=away_team,
                        sport=league.sport,
                        league=league,
                        date=match_date,
                        home_score=home_score,
                        away_score=away_score,
                        status=status
                    )
                    total_matches_created += 1
                    print(f" {home_team.name} {home_score} - {away_score} {away_team.name} ({match_date})")

    print(f"\n Done! {total_matches_created} total matches created.")
