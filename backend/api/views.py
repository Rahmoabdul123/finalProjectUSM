from django.shortcuts import render
from django.contrib.auth import get_user_model, authenticate
from rest_framework import generics
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import University,Team,TeamMembership,Sport,Match,MatchAvailability,LeagueTable,PlayerGoal
from .serializers import UserSerializer, UniversitySerializer,TeamSerializer,TeamMembershipSerializer,TeamMemberWithGoalsSerializer,SportSerializer,MatchSerializer,MatchAvailabilitySerializer,LeagueTableSerializer,PlayerGoalSerializer,ChangePasswordSerializer,UserProfileDetailSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from rest_framework.views import APIView
from django.db.models import Q
from django.db.models import Sum


User = get_user_model()

# Custom token view
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer



# Dashboard route that returns a different message for Admins and Students
class UserDashboardView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        user = request.user

        if hasattr(user, "role"):
            if user.role == "Admin":
                return Response({"message": "Welcome, Admin!", "dashboard": "/admin-dashboard"})
            else:
                return Response({"message": "Welcome, Student!", "dashboard": "/student-dashboard"})
        else:
            return Response({"message": "User role not found."}, status=400)


# Endpoint to allow user registration (sign-up)
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# Public endpoint to list all universities
class ListUniversitiesView(generics.ListAPIView):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer
    permission_classes = [AllowAny] #To allow it be shown in the registration


# Get teams based on user's university and optional sport filter
class TeamsByUniversityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        university = request.user.university # Finds the university the user belongs to
        sport = request.GET.get('sport')

        teams = Team.objects.filter(university=university) # Filters all teams that belongs to that specific university

        if sport:
            teams = teams.filter(sport__name=sport) # narrows the teams down depending on what sport is chosen

        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data)



# Teams: Request to join a team (students only, must be same university)

class RequestJoinTeamView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, team_id):
        try:
            team = Team.objects.get(id=team_id)
        except Team.DoesNotExist:
            return Response({"detail": "Team not found."}, status=403)
        
        # ensures the user's uni matches the team's uni
        if request.user.university != team.university:
            return Response({"detail": "You can only join teams from your university."}, status=403)
        
        # Prevent students requesting the same team more than once
        if TeamMembership.objects.filter(user=request.user, team=team).exists():
            return Response({"detail": "You already requested or joined this team."}, status=400)
        
        # Create a pending join request
        TeamMembership.objects.create(user=request.user, team=team, status="Pending")
        return Response({"detail": "Join request submitted."}, status=201)




# Ensuring admins can be the only one seeing the request and view to list all pending join requests for their university

class PendingJoinRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "Admin": #ensures only admin can see the requests
            return Response({"detail": "Only admins can view requests."}, status=403)

        university = request.user.university 
        # retrieves all pending requests of that specific university
        requests = TeamMembership.objects.filter(
            team__university=university,
            status="Pending"
        )

        serializer = TeamMembershipSerializer(requests, many=True)
        return Response(serializer.data)


#Lists all of the sports team
class ListSportsView(generics.ListAPIView):
    queryset = Sport.objects.all()
    serializer_class = SportSerializer
    permission_classes = [IsAuthenticated]



# allows Admin action to approve or reject a join request
class HandleJoinRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, membership_id):
        user = request.user

        if user.role != "Admin": #only Admins can accept/reject requests
            return Response({"detail": "Only admins can manage requests."}, status=403)

        try:
            # Try to find the pending membership request for this admin's university
            membership = TeamMembership.objects.get(id=membership_id, team__university=user.university)
        except TeamMembership.DoesNotExist:
            return Response({"detail": "Request not found."}, status=404)

        action = request.data.get("action") # get the action sent by the frontend

        if action not in ["Approve", "Reject"]:
            return Response({"detail": "Invalid action."}, status=400)
        
         # Update membership status based on what action was chosen
        membership.status = action
        membership.save()

        if action == "Approve":
            team_data = TeamSerializer(membership.team).data
            return Response({"detail": "Request approved.", "team": team_data})

        return Response({"detail": "Request rejected."})
    

# Admin action to approve or reject a join request
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data["new_password"])
            user.save()
            return Response({"detail": "Password changed successfully."}, status=200)
        return Response(serializer.errors, status=400)


# allows both admins and students to update their first name, last name, and email
class UserProfileDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = UserProfileDetailSerializer(
            request.user, data=request.data, partial=True, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "User details updated successfully."})
        return Response(serializer.errors, status=400)


#this would list out the teams that the user is in

class MyTeamsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        #looks inside the TeamMembership table and filters the approved rows 
        memberships = TeamMembership.objects.filter(user=request.user, status="Approve") 
        teams = [membership.team for membership in memberships] ## Extract the teams from those memberships
        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data)
    

# View to return all approved members of a specific team and shows goals and position


class TeamMembersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, team_id):
        print("Fetching members for team:", team_id) #helps debugging

        memberships = TeamMembership.objects.filter(
            team_id=team_id,
            status__iexact="approve"
        ).select_related('user')# Optimize database queries by fetching related user objects in one query

        print("Members found:", memberships.count())

        # Pre-fetch goals in bulk
        goals_by_user = PlayerGoal.objects.filter(team_id=team_id)\
            .values('user_id')\
            .annotate(total_goals=Sum('goals'))
        
        #Convert goals query into a python dictionary
        goals_dict = {item['user_id']: item['total_goals'] for item in goals_by_user}

        # Build raw data
        raw_data = [
            {
                "id": member.user.id,
                "full_name": f"{member.user.first_name} {member.user.last_name}",
                "position": member.position, # Position (can be null)
                "goals_scored": goals_dict.get(member.user.id, 0),# Total goals scored (default to 0 if none)
                "is_self": member.user == request.user,
            }
            for member in memberships
        ]

        # Use the serializer to validate and serialize the data
        serializer = TeamMemberWithGoalsSerializer(raw_data, many=True)
        return Response(serializer.data)


#showing upcoming matches across all sports the user is in
class MyMatchesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Find all the teams the user belongs to
        team_ids = TeamMembership.objects.filter(
            user=request.user, 
            status="Approve"
        ).values_list('team_id', flat=True)

        # Find the very next match
        next_match = Match.objects.filter(
            status="Pending"
        ).filter(
            Q(home_team_id__in=team_ids) | Q(away_team_id__in=team_ids)
        ).order_by('date').first()

        if next_match:
            serializer = MatchSerializer(next_match)
            return Response(serializer.data)
        else:
            return Response({"detail": "No upcoming matches."}, status=404)



   
#Viewing past and future matches in their own team (hoping to add that as a tab)
class TeamMatchesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, team_id):
        # Fetch matches where the team is either the home or away team
        matches = Match.objects.filter(
            Q(home_team_id=team_id) | Q(away_team_id=team_id)
        ).order_by('date')# Sort matches by date from earliest

        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)


# Manage match availability (student: own; admin: everyone in uni)

class MatchAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, match_id):
        user = request.user

        if user.role == "Admin":
            # Admin can view availability of all players in matches from their university
            availabilities = MatchAvailability.objects.filter(
                match_id=match_id,
                user__university=user.university
            ).select_related("user") # Optimize DB query by pulling user fields

            data = [
                {
                    "player": f"{availability.user.first_name} {availability.user.last_name}",
                    "is_attending": availability.is_attending,
                    "responded_at": availability.responded_at
                }
                for availability in availabilities
            ]
            return Response(data)

        else:
            # Students see their own availability ("you're marked as Available")
            try:
                availability = MatchAvailability.objects.get(match_id=match_id, user=user)
                serializer = MatchAvailabilitySerializer(availability)
                return Response(serializer.data)
            except MatchAvailability.DoesNotExist:
                return Response({"detail": "No availability set."}, status=404)

    def post(self, request, match_id):
        user = request.user
        is_attending = request.data.get("is_attending") #true or false in database

        if is_attending is None:
            return Response({"detail": "Missing 'is_attending' value."}, status=400)
        
        # Create a new availability record OR update the existing one
        availability, created = MatchAvailability.objects.update_or_create(
            match_id=match_id,
            user=user,
            defaults={"is_attending": is_attending}
        )

        serializer = MatchAvailabilitySerializer(availability)
        return Response(serializer.data, status=200 if not created else 201)



# API view to generate and return the league standings
class LeagueStandingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, league_id):
        # Fetch all teams associated with the given league
        teams = Team.objects.filter(league_id=league_id)

        # Get only the matches that have been played and belong to the same league
        matches = Match.objects.filter(league_id=league_id, status="Played")

        standings = []
        for team in teams:
            # Initial stats
            stats = {
                "played": 0,
                "won": 0,
                "draw": 0,
                "lost": 0,
                "goals_scored": 0,
                "goals_conceded": 0,
                "points": 0,
            }

            for match in matches:
                # Check if the team participated in this match
                is_home = match.home_team == team
                is_away = match.away_team == team

                if not (is_home or is_away):
                    continue  # Skip matches where this team didn't participate
                # Updating Stats depending on the results 

                stats["played"] += 1
                # Determine which side the team played and assign scores accordingly
                team_score = match.home_score if is_home else match.away_score
                opponent_score = match.away_score if is_home else match.home_score

                stats["goals_scored"] += team_score or 0
                stats["goals_conceded"] += opponent_score or 0

                # Update win/draw/loss stats
                if team_score > opponent_score:
                    stats["won"] += 1
                    stats["points"] += 3
                elif team_score < opponent_score:
                    stats["lost"] += 1
                else:
                    stats["draw"] += 1
                    stats["points"] += 1

            # Add team's final stats and goal difference to standings list
            standings.append({
                "team_id": team.id,
                "team_name": team.name,
                "goal_difference": stats["goals_scored"] - stats["goals_conceded"],
                **stats,
            })

        # Define how the standings should be sorted: 
        # first by points, then goal difference, then goals scored
        def sort_by_standings(item):
             return (item["points"], item["goal_difference"], item["goals_scored"])

        standings.sort(key=sort_by_standings, reverse=True)

        return Response(standings)


#shows all of the leagues
class ListLeaguesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        leagues = LeagueTable.objects.all()
        serializer = LeagueTableSerializer(leagues, many=True)
        return Response(serializer.data)


# view to find all teams specifically from the univeristy that the admin belongs to
class AdminUniversityTeamsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "Admin":
            return Response({"detail": "Only admins can view this."}, status=403)

        university = request.user.university # gets the university the admin belongs to
        teams = Team.objects.filter(university=university)  #filters the teams that belong to that same university
        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data)



# Admins being able to only edit the score
class EditMatchScoreView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, match_id):
        if request.user.role != "Admin":
            return Response({"detail": "Only admins can edit match scores."}, status=403)

        try:
            match = Match.objects.get(id=match_id)
        except Match.DoesNotExist:
            return Response({"detail": "Match not found."}, status=404)

        # Make sure the admin is from the same university
        if match.home_team.university != request.user.university and match.away_team.university != request.user.university:
            return Response({"detail": "You can only edit matches from your university."}, status=403)

        home_score = request.data.get("home_score")
        away_score = request.data.get("away_score")
        match_date = request.data.get("date")
        match_status = request.data.get("status")

        # Allow updating date regardless of status
        if match_date:
            match.date = match_date

        # If scores are being submitted
        if home_score is not None and away_score is not None:
            match.home_score = home_score
            match.away_score = away_score
            match.status = "Played"  # Automatically mark as played if scores are given

        elif match_status:  # Allow setting status manually to "Pending" etc.
            if match_status in ["Pending", "Played"]:
                match.status = match_status

        # Save and return
        match.save()
        return Response({"detail": "Match updated successfully."}, status=200)
    

# Admin view to list all players in a specific team

class AdminTeamMembersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, team_id):
        if request.user.role != "Admin":
            return Response({"detail": "Only admins can view team members."}, status=403)

        try:
            team = Team.objects.get(id=team_id)
        except Team.DoesNotExist:
            return Response({"detail": "Team not found."}, status=404)
        # Ensure Admin is only accessing their own university teams
        if team.university != request.user.university:
            return Response({"detail": "You can only view teams from your university."}, status=403)
        # Get all approved members for the team
        members = TeamMembership.objects.filter(team=team, status="Approve").select_related("user")

        data = []
        for member in members:
            total_goals = (
                PlayerGoal.objects.filter(user=member.user, team=team)
                .aggregate(Sum("goals"))["goals__sum"] or 0
            )

            data.append({
                "id": member.user.id,
                "name": f"{member.user.first_name} {member.user.last_name}",
                "position": member.position,
                "goals_scored": total_goals
            })

        return Response(data)

# Admin being able to see both home and away player's availability
class AdminMatchAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, match_id):
        if request.user.role != "Admin":
            return Response({"detail": "Only admins can view this."}, status=403)

        try:
            match = Match.objects.get(id=match_id)
        except Match.DoesNotExist:
            return Response({"detail": "Match not found."}, status=404)
        
        # Confirm match belongs to admin's university
        if match.home_team.university != request.user.university and match.away_team.university != request.user.university:
            return Response({"detail": "Match not in your university."}, status=403)

        availability = MatchAvailability.objects.filter(match=match).select_related("user")

        home_team_data = []
        away_team_data = []

        # Sort players by their team membership
        for a in availability:
            player_data = {
                "user": f"{a.user.first_name} {a.user.last_name}",
                "is_attending": a.is_attending,
                "responded_at": a.responded_at,
            }

            if TeamMembership.objects.filter(user=a.user, team=match.home_team, status="Approve").exists():
                home_team_data.append(player_data)
            elif TeamMembership.objects.filter(user=a.user, team=match.away_team, status="Approve").exists():
                away_team_data.append(player_data)

        return Response({
            "home_team": match.home_team.name,
            "away_team": match.away_team.name,
            "home_team_players": home_team_data,
            "away_team_players": away_team_data,
        })


#--------------------------------
class AssignPlayerGoalsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, match_id):
        if request.user.role != "Admin":
            return Response({"detail": "Only admins can assign goals."}, status=403)

        try:
            match = Match.objects.get(id=match_id)
        except Match.DoesNotExist:
            return Response({"detail": "Match not found."}, status=404)

        data = request.data

        updated_goals = []
        for entry in data:
            player_id = entry.get("user_id")
            team_id = entry.get("team_id")
            goals = entry.get("goals")

            if not (player_id and team_id and goals is not None):
                continue

            try:
                player = User.objects.get(id=player_id)
                team = Team.objects.get(id=team_id)
            except (User.DoesNotExist, Team.DoesNotExist):
                continue

            goal_entry, created = PlayerGoal.objects.update_or_create(
                match=match,
                user=player,
                defaults={"team": team, "goals": goals}
            )
            updated_goals.append(goal_entry)

        serializer = PlayerGoalSerializer(updated_goals, many=True)
        return Response(serializer.data)

#-------------------------------------------------------------------------------------------------------------------
# Allows a user to update their position in a specific team
class UpdatePlayerPositionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, team_id):
        # 1. Get the new position value from the request data
        new_position = request.data.get("position")
        if not new_position:
            return Response({"detail": "Position is required."}, status=400)

        try:
            # Fetch the team membership where user is approved
            membership = TeamMembership.objects.get(user=request.user, team_id=team_id, status="Approve")
        except TeamMembership.DoesNotExist:
            return Response({"detail": "You are not a member of this team."}, status=404)
        #update the user's position
        membership.position = new_position
        membership.save()

        return Response({"detail": "Position updated successfully."})

#-------------------------------------------------------------------------------------------------------------------
# Finds the top scorers in the Team
class TopTeamScorersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, team_id):
        #grabs top 5 players based  on total goals 
        top_players = (
            PlayerGoal.objects.filter(team_id=team_id)
            .values("user__first_name", "user__last_name", "user__id")
            .annotate(total_goals=Sum("goals"))
            .order_by("-total_goals")[:5]
        )

        data = [
            {
                "user_id": p["user__id"],
                "name": f"{p['user__first_name']} {p['user__last_name']}",
                "total_goals": p["total_goals"]
            }
            for p in top_players
        ]

        return Response(data) 

    
#-------------------------------------------------------------------------------------------------------------------
#Finds the top scorers in the Team
class TopLeagueScorersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, league_id):
        top_players = (
            PlayerGoal.objects.filter(match__league_id=league_id)
            .values("user__first_name", "user__last_name", "user__id")
            .annotate(total_goals=Sum("goals"))
            .order_by("-total_goals")[:5]
        )

        data = [
            {
                "user_id": p["user__id"],
                "name": f"{p['user__first_name']} {p['user__last_name']}",
                "total_goals": p["total_goals"]
            }
            for p in top_players
        ]

        return Response(data)

