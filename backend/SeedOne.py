from api.models import University

def run():
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
            print(f"Created: {obj.name} ")
        else:
            print(f"Already exists: {obj.name}")
