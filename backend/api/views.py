from django.shortcuts import render
from django.contrib.auth import get_user_model, authenticate
from rest_framework import generics
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import University, Note
from .serializers import UserSerializer, UniversitySerializer, NoteSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

User = get_user_model()  # ✅ Ensure Django uses the custom User model

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_dashboard(request):
    """✅ Returns different responses for Admins & Students"""
    user = request.user
    if user.role == "Admin":
        return Response({"message": "Welcome, Admin!", "dashboard": "/admin-dashboard"})
    else:
        return Response({"message": "Welcome, Student!", "dashboard": "/student-dashboard"})
 

# ✅ 1. List Universities API (For Registration Dropdown)
@api_view(["GET"])
def list_universities(request):
    universities = University.objects.all()
    serializer = UniversitySerializer(universities, many=True)
    return Response(serializer.data)

# ✅ 2. User Registration API
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# ✅ 3. Create & List Notes (For Testing Redirection)
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)

# ✅ 4. Delete Notes (For Testing)
class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

