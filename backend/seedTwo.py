from api.models import LeagueTable, Sport

def run():
    genders = ["Girls", "Boys"]
    sports = Sport.objects.all()

    for sport in sports:
        for gender in genders:
            league_name = f"{gender}' {sport.name} League"
            league, created = LeagueTable.objects.get_or_create(
                name=league_name,
                sport=sport,
                gender=gender
            )
            if created:
                print(f" Created league: {league_name}")
            else:
                print(f" League already exists: {league_name}")

