from django.shortcuts import render
from django.contrib.auth import get_user_model, authenticate
from rest_framework import generics
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import University, Note,Team,TeamMembership
from .serializers import UserSerializer, UniversitySerializer, NoteSerializer,TeamSerializer,TeamMembershipSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from .models import Sport
from .serializers import SportSerializer
from rest_framework.views import APIView

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

