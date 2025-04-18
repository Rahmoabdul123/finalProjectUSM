from api.models import Sport

def run():
    sports = ["Football", "Hockey", "Basketball"]

    for sport_name in sports:
        sport, created = Sport.objects.get_or_create(name=sport_name)
        if created:
            print(f" Created sport: {sport.name}")
        else:
            print(f" Already exists: {sport.name}")