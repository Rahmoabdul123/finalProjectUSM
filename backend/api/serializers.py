from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Note, University, TeamMembership, Team, Sport, Match,MatchAvailability,LeagueTable,PlayerGoal

User = get_user_model()  # Get the custom user model


class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ["id", "name", "location"]

# Serializer for the custom User model
class UserSerializer(serializers.ModelSerializer):
    university = serializers.PrimaryKeyRelatedField(queryset=University.objects.all()) #link to university by ID

    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email", "password", "university", "role"]

        extra_kwargs = {
            "password": {"write_only": True},
            "role": {"read_only": True}, #Don't want the users to choose their roles , needs to be read only
        }

    def create(self, validated_data):
        """ Uses the properly overridden `create_user()` method"""
        return User.objects.create_user(**validated_data)

# Custom token serializer to include additional user info in JWT response
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user  # Get the authenticated user

        
        data["first_name"] = user.first_name
        data["last_name"] = user.last_name
        data["role"] = user.role
        data["university"] = user.university.id if user.university else None
        return data


# Serializer for Sport model
class SportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sport
        fields = ['id', 'name']


# Sport Serializer
class SportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sport
        fields = ["id", "name"]


class LeagueTableSerializer(serializers.ModelSerializer):
    sport_name = serializers.CharField(source='sport.name', read_only=True)

    class Meta:
        model = LeagueTable
        fields = ['id', 'name', 'sport', 'sport_name', 'gender']

# Team Serializer
class TeamSerializer(serializers.ModelSerializer):
    university = UniversitySerializer(read_only=True)
    sport = SportSerializer(read_only=True)
    league = LeagueTableSerializer(read_only=True)
    
    class Meta:
        model = Team
        fields = ["id", "name", "university", "sport", "created_by","league"]

# Team Membership Serializer (for viewing teammates, score tracking)
class TeamMembershipSerializer(serializers.ModelSerializer):
    user_full_name = serializers.SerializerMethodField()
    team_name = serializers.CharField(source="team.name", read_only=True)

    class Meta:
        model = TeamMembership
        fields = ["id", "user_full_name","team_name", "position", "goals_scored", "status"]

    def get_user_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

# Separate serializer for creating a join request
class TeamMembershipCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMembership
        fields = ["team"]

# Serializer to return only the basic info for a team (used inside the match serializer)
class TeamBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name'] # Only return team ID and name (e.g. "Yellow uni Girl's Football")

class MatchSerializer(serializers.ModelSerializer): # Serializer to format match data, including team info as nested objects
    # Nest the team info using the basic serializer above
    home_team = TeamBasicSerializer()
    away_team = TeamBasicSerializer()

    class Meta:
        model = Match
        # Return the key fields needed to display a match (played or upcoming)
        fields = ['id', 'date', 'home_team', 'away_team', 'home_score', 'away_score', 'status']


class MatchAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchAvailability
        fields = ['id', 'match', 'user', 'is_attending', 'responded_at']
        read_only_fields = ['responded_at', 'user']


class PlayerGoalSerializer(serializers.ModelSerializer):
    player_name = serializers.SerializerMethodField()

    class Meta:
        model = PlayerGoal
        fields = ['user', 'player_name', 'match', 'team', 'goals', 'scored_at']

    def get_player_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
