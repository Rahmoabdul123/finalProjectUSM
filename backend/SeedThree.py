from api.models import Team, LeagueTable

def run():
    for team in Team.objects.all():
        # allocating by finding girls or boys in the name of the team
        if "girl" in team.name.lower():
            gender = "Girls"
        elif "boy" in team.name.lower():
            gender = "Boys"
        else:
            print(f"gender not found so skipped: {team.name}")
            continue

        #Finding the matching league
        try:
            league = LeagueTable.objects.get(sport=team.sport, gender=gender)
        except LeagueTable.DoesNotExist:
            print(f" No league found for {team.name} ({gender}, {team.sport.name})")
            continue

        # Assign and save
        team.league = league
        team.save()
        print(f" Assigned {team.name} → {league.name}")
