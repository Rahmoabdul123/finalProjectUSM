from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Note, University, TeamMembership, Team, Sport

User = get_user_model()  


class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ["id", "name", "location"]

class UserSerializer(serializers.ModelSerializer):
    university = serializers.PrimaryKeyRelatedField(queryset=University.objects.all())

    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email", "password", "university", "role"]

        extra_kwargs = {
            "password": {"write_only": True},
            "role": {"read_only": True},
        }

    def create(self, validated_data):
        """ Uses the properly overridden `create_user()` method"""
        return User.objects.create_user(**validated_data)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user  # Get the authenticated user

        
        data["first_name"] = user.first_name
        data["last_name"] = user.last_name
        data["role"] = user.role
        data["university"] = user.university.id if user.university else None
        return data

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}

class SportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sport
        fields = ['id', 'name']


# Sport Serializer
class SportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sport
        fields = ["id", "name"]

# Team Serializer
class TeamSerializer(serializers.ModelSerializer):
    university = UniversitySerializer(read_only=True)
    sport = SportSerializer(read_only=True)
    
    class Meta:
        model = Team
        fields = ["id", "name", "university", "sport", "created_by"]

# Team Membership Serializer (for viewing teammates, score tracking, etc.)
class TeamMembershipSerializer(serializers.ModelSerializer):
    user_full_name = serializers.SerializerMethodField()

    class Meta:
        model = TeamMembership
        fields = ["id", "user_full_name", "position", "goals_scored", "status"]

    def get_user_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

# Separate serializer for creating a join request
class TeamMembershipCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMembership
        fields = ["team"]
