from django.shortcuts import render
from django.contrib.auth import get_user_model, authenticate
from rest_framework import generics
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import University, Note,Team,TeamMembership,Sport,Match,MatchAvailability,LeagueTable
from .serializers import UserSerializer, UniversitySerializer, NoteSerializer,TeamSerializer,TeamMembershipSerializer,SportSerializer,MatchSerializer,MatchAvailabilitySerializer,LeagueTableSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from rest_framework.views import APIView
from django.db.models import Q


User = get_user_model()
# -----------------------------------------------------------------------------------------------------
# Custom token view
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# -----------------------------------------------------------------------------------------------------
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

# -----------------------------------------------------------------------------------------------------
# Endpoint to allow user registration (sign-up)
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# -----------------------------------------------------------------------------------------------------
# Public endpoint to list all universities
class ListUniversitiesView(generics.ListAPIView):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer
    permission_classes = [AllowAny] #To allow it be shown in the registration


# -----------------------------------------------------------------------------------------------------
# TO be removed
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)

#To be removed
class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)
    


# -----------------------------------------------------------------------------------------------------
# Get teams based on user's university and optional sport filter
class TeamsByUniversityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        university = request.user.university
        sport = request.GET.get('sport')

        teams = Team.objects.filter(university=university)

        if sport:
            teams = teams.filter(sport__name=sport)

        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data)


# -----------------------------------------------------------------------------------------------------
# Teams: Request to join a team (students only, must be same university)

class RequestJoinTeamView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, team_id):
        try:
            team = Team.objects.get(id=team_id)
        except Team.DoesNotExist:
            return Response({"detail": "Team not found."}, status=403)
        # makes sure user is only joining teams from their university
        if request.user.university != team.university:
            return Response({"detail": "You can only join teams from your university."}, status=403)
        # Prevent students from duplicating the requests if they already joined a team
        if TeamMembership.objects.filter(user=request.user, team=team).exists():
            return Response({"detail": "You already requested or joined this team."}, status=400)
        
        # Create a pending join request
        TeamMembership.objects.create(user=request.user, team=team, status="Pending")
        return Response({"detail": "Join request submitted."}, status=201)



#-----------------------------------------------------------------------------------------------------------------------
# Ensuring admins can be the only one seeing the request and view to list all pending join requests for their university

class PendingJoinRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "Admin":
            return Response({"detail": "Only admins can view requests."}, status=403)

        university = request.user.university
        # Get all pending join requests from the admin's university
        requests = TeamMembership.objects.filter(
            team__university=university,
            status="Pending"
        )

        serializer = TeamMembershipSerializer(requests, many=True)
        return Response(serializer.data)

#-----------------------------------------------------------------------------------------------------------------------
#Lists all of the sports team
class ListSportsView(generics.ListAPIView):
    queryset = Sport.objects.all()
    serializer_class = SportSerializer
    permission_classes = [IsAuthenticated]


#-----------------------------------------------------------------------------------------------------------------------
# Admin action to approve or reject a join request
class HandleJoinRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, membership_id):
        user = request.user

        if user.role != "Admin":
            return Response({"detail": "Only admins can manage requests."}, status=403)

        try:
            membership = TeamMembership.objects.get(id=membership_id, team__university=user.university)
        except TeamMembership.DoesNotExist:
            return Response({"detail": "Request not found."}, status=404)

        action = request.data.get("action")

        if action not in ["Approve", "Reject"]:
            return Response({"detail": "Invalid action."}, status=400)
        
         # Update membership status
        membership.status = action
        membership.save()

        if action == "Approve":
            team_data = TeamSerializer(membership.team).data
            return Response({"detail": "Request approved.", "team": team_data})

        return Response({"detail": "Request rejected."})
    

#-----------------------------------------------------------------------------------------------------------------------    
#this would list out the teams that the user is in

class MyTeamsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        memberships = TeamMembership.objects.filter(user=request.user, status="Approve")
        teams = [membership.team for membership in memberships]
        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data)
    
#-----------------------------------------------------------------------------------------------------------------------    
#viewing Teammates in their team


class TeamMembersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, team_id):
        # Debug output
        print("Fetching members for team:", team_id)

        # Get all approved members 
        memberships = TeamMembership.objects.filter(
            team_id=team_id,
            status__iexact="approve" # "approve" would always work regardless of casing
        ).select_related('user')

        print("Members found:", memberships.count())

        data = [
            {
                "id": member.user.id,
                "full_name": f"{member.user.first_name} {member.user.last_name}",
                "position": member.position,
                "goals_scored": member.goals_scored,
            }
            for member in memberships
        ]

        return Response(data)
    

#Viewing past and future matches in their own team (hoping to add that as a tab)

class MyMatchesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get all approved teams the user is part of
        memberships = TeamMembership.objects.filter(user=request.user, status="Approved")
        team_ids = memberships.values_list('team_id', flat=True)

        # Match history (status = Played)
        past_matches = Match.objects.filter(
            status="Played"
        ).filter(
            home_team_id__in=team_ids
        ) | Match.objects.filter(
            status="Played",
            away_team_id__in=team_ids
        )

        # Upcoming matches (status = Pending)
        upcoming_matches = Match.objects.filter(
            status="Pending"
        ).filter(
            home_team_id__in=team_ids
        ) | Match.objects.filter(
            status="Pending",
            away_team_id__in=team_ids
        )

        # Serialize and return
        history = MatchSerializer(past_matches, many=True).data
        upcoming = MatchSerializer(upcoming_matches, many=True).data

        return Response({
            "history": history,
            "upcoming": upcoming
        })

class TeamMatchesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, team_id):
        matches = Match.objects.filter(
            Q(home_team_id=team_id) | Q(away_team_id=team_id)
        ).order_by('date')

        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)


#-----------------------------------------------------------------------------------------------------------------------    
#viewing Teammates in their team

class MatchAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, match_id):
        try:
            availability = MatchAvailability.objects.get(match_id=match_id, user=request.user)
            serializer = MatchAvailabilitySerializer(availability)
            return Response(serializer.data)
        except MatchAvailability.DoesNotExist:
            return Response({"detail": "No availability set."}, status=404)


    def post(self, request, match_id):
        user = request.user
        is_attending = request.data.get("is_attending")

        if is_attending is None:
            return Response({"detail": "Missing 'is_attending' value."}, status=400)

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
            # Initialize stats for the team
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


class ListLeaguesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        leagues = LeagueTable.objects.all()
        serializer = LeagueTableSerializer(leagues, many=True)
        return Response(serializer.data)


class AdminUniversityTeamsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "Admin":
            return Response({"detail": "Only admins can view this."}, status=403)

        university = request.user.university
        teams = Team.objects.filter(university=university)
        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data)



class EditMatchScoreView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, match_id):
        if request.user.role != "Admin":
            return Response({"detail": "Only admins can edit match scores."}, status=403)

        try:
            match = Match.objects.get(id=match_id)
        except Match.DoesNotExist:
            return Response({"detail": "Match not found."}, status=404)

        # Ensure the match is from the admin's university
        admin_university = request.user.university
        if match.home_team.university != admin_university and match.away_team.university != admin_university:
            return Response({"detail": "You can only edit matches from your university."}, status=403)

        # Only allow score edits for played matches
        if match.status != "Played":
            return Response({"detail": "Can only edit scores for matches that have been played."}, status=400)

        home_score = request.data.get("home_score")
        away_score = request.data.get("away_score")

        if home_score is None or away_score is None:
            return Response({"detail": "Both scores are required."}, status=400)

        # Update the match scores
        match.home_score = home_score
        match.away_score = away_score
        match.save()

        return Response({"detail": "Match scores updated successfully."}, status=200)