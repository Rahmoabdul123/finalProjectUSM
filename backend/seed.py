from api.models import University, Sport, Team
from django.contrib.auth import get_user_model

User = get_user_model()

def run():
    # Fetch admin
    admin_user = User.objects.filter(role="Admin").first()
    if not admin_user:
        print(" No admin user found.")
        return

    # Fetch universities
    try:
        yellow = University.objects.get(name="University of Yellow")
        magenta = University.objects.get(name="University of Magenta")
        maroon = University.objects.get(name="Maroon University")
        forest = University.objects.get(name="Forest Green Tech")
    except University.DoesNotExist as e:
        print(f" University not found: {e}")
        return

    # Function to create teams
    def create_teams(university, prefix):
        sports = {
            "Football": Sport.objects.get(name="Football"),
            "Hockey": Sport.objects.get(name="Hockey"),
            "Basketball": Sport.objects.get(name="Basketball"),
        }

        for sport_name, sport in sports.items():
            Team.objects.create(
                name=f"{prefix} Girl's {sport_name}",
                university=university,
                sport=sport,
                created_by=admin_user
            )
            Team.objects.create(
                name=f"{prefix} Boy's {sport_name}",
                university=university,
                sport=sport,
                created_by=admin_user
            )

    # Create teams for each university
    create_teams(yellow, "Yellow uni")
    create_teams(magenta, "Magenta uni")
    create_teams(maroon, "Maroon uni")
    create_teams(forest, "Forest Green uni")

    print(" Teams seeded successfully.")
