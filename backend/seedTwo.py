from api.models import University, Sport, Team
from django.contrib.auth import get_user_model

User = get_user_model()

def run():
    # Step 1: Ensure there's at least one Admin
    admin_user = User.objects.filter(role="Admin").first()
    
    if not admin_user:
        
        try:
            university = University.objects.get(name="University of Yellow")
        except University.DoesNotExist:
            print("University of Yellow must exist before creating the Admin.")
            return

        admin_user = User.objects.create_user(
            first_name="YellowAdmin",
            last_name="Uni",
            email="yellowAdmin@hotmail.com",
            password="yellowAdmin123",
            university=university,
            role="Admin"
        )
        print(" Default Admin created: yellowAdmin@hotmail.com (password: yellowAdmin123)")

    try:
        yellow = University.objects.get(name="University of Yellow")
        magenta = University.objects.get(name="University of Magenta")
        maroon = University.objects.get(name="Maroon University")
        forest = University.objects.get(name="Forest Green Tech")
    except University.DoesNotExist as e:
        print(f" University not found: {e}")
        return

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

    create_teams(yellow, "Yellow uni")
    create_teams(magenta, "Magenta uni")
    create_teams(maroon, "Maroon uni")
    create_teams(forest, "Forest Green uni")

    print(" Teams seeded successfully.")
