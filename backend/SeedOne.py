from api.models import University, Sport

def run():
    # Step 1: Seed Universities
    universities = [
        {"name": "University of Yellow", "location": "Sunrise City"},
        {"name": "University of Magenta", "location": "Roseville"},
        {"name": "Maroon University", "location": "Bricktown"},
        {"name": "Forest Green Tech", "location": "Evergreen Valley"},
    ]

    for uni in universities:
        obj, created = University.objects.get_or_create(
            name=uni["name"],
            defaults={"location": uni["location"]}
        )
        if created:
            print(f"Created University: {obj.name}")
        else:
            print(f"University already exists: {obj.name}")

    # Step 2: Seed Sports
    sports = ["Football", "Hockey", "Basketball"]

    for sport_name in sports:
        sport, created = Sport.objects.get_or_create(name=sport_name)
        if created:
            print(f"Created Sport: {sport.name}")
        else:
            print(f"Sport already exists: {sport.name}")

    print(" Universities and Sports seeded successfully.")
