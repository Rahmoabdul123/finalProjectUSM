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

User = get_user_model()

# Custom token view to return extra user data along with the JWT token
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# Dashboard route that returns a different message for Admins and Students
@api_view(["GET"])
@permission_classes([AllowAny])
def user_dashboard(request):
    """ Returns different responses for Admins & Students"""
    user = request.user
    if user.role == "Admin":
        return Response({"message": "Welcome, Admin!", "dashboard": "/admin-dashboard"})
    else:
        return Response({"message": "Welcome, Student!", "dashboard": "/student-dashboard"})
 

# Public endpoint to list all universities
@api_view(["GET"])
@permission_classes([AllowAny]) # Allow any to make it public
def list_universities(request):
    universities = University.objects.all()
    serializer = UniversitySerializer(universities, many=True)
    return Response(serializer.data)

# Endpoint to allow user registration (sign-up)
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# 
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)

#
class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)
    
# Get teams based on user's university and optional sport filter
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teams_by_university(request):
    university = request.user.university
    sport = request.GET.get('sport')  # optional filter to choose the sports

    teams = Team.objects.filter(university=university)

    if sport:
        teams = teams.filter(sport__name=sport)

    serializer = TeamSerializer(teams, many=True)
    return Response(serializer.data)


# Student requests to join a team
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_join_team(request, team_id):
    team = Team.objects.get(id=team_id)

    # checks the students belong to the same university
    if request.user.university != team.university:
        return Response({"detail": "You can only join teams from your university."}, status=403)

    # Check and prevents duplicates
    if TeamMembership.objects.filter(user=request.user, team=team).exists():
        return Response({"detail": "You already requested or joined this team."}, status=400)
    
    # Create a pending join request
    TeamMembership.objects.create(user=request.user, team=team, status="Pending")
    return Response({"detail": "Join request submitted."})

# Ensuring admins can be the only one seeing the request and view to list all pending join requests for their university
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pending_join_requests(request):
    if request.user.role != "Admin":
        return Response({"detail": "Only admins can view requests."}, status=403)
        
    university = request.user.university

    requests = TeamMembership.objects.filter(
        team__university=university,
        status="Pending"
    )

    serializer = TeamMembershipSerializer(requests, many=True)
    return Response(serializer.data)


#Lists all of the sports team
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_sports(request):
    sports = Sport.objects.all()
    serializer = SportSerializer(sports, many=True)
    return Response(serializer.data)

# Admin action to approve or reject a join request
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def handle_join_request(request, membership_id):
    if request.user.role != "Admin":
        return Response({"detail": "Only admins can manage requests."}, status=403)

    try:
        membership = TeamMembership.objects.get(id=membership_id, team__university=request.user.university)
    except TeamMembership.DoesNotExist:
        return Response({"detail": "Request not found."}, status=404)

    action = request.data.get("action")

    if action not in ["Approve", "Reject"]:
        return Response({"detail": "Invalid action."}, status=400)

    membership.status = action
    membership.save()
    
    if action == "Approve":
        team_data = TeamSerializer(membership.team).data
        return Response({"detail": "Request approved.", "team": team_data})

    return Response({"detail": "Request rejected."})

    return Response({"detail": f"Request {action.lower()}ed successfully."})