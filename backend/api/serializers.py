from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import University, TeamMembership, Team, Sport, Match,MatchAvailability,LeagueTable,PlayerGoal
from django.contrib.auth.password_validation import validate_password

User = get_user_model()  # Get the custom user model

# Code Inspired from: [Django & React Web App Tutorial - Authentication, Databases, Deployment & More], [Tech with Team], [https://www.youtube.com/watch?v=c-QsfbznSXI]
#  I were inspired by The Serializer template from the video and heavily edited mine
#  Accessed: [date you watched it]

#Serializer for university 
class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ["id", "name", "location"]
#----------------------------------------------------------------------------------------------------------   
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
    def validate_password(self, value):
        # used Django's validation rules for stronger
        validate_password(value)
        return value

    def create(self, validated_data):
        """ Uses the properly overridden `create_user()` method"""
        return User.objects.create_user(**validated_data)
#----------------------------------------------------------------------------------------------------------   
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

#Serializer to help change the password   
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    # Validate the old password
    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value
    
    # Validate the new password
    def validate(self, data):
        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError("New passwords do not match.")
        validate_password(data["new_password"], self.context["request"].user)
        return data
    
#Seralizer to help change first name, last name  or/and email
class UserProfileDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "email"]

    # Custom email validation to ensure uniqueness across users
    def validate_email(self, value):
        user = self.context["request"].user
        if User.objects.exclude(pk=user.pk).filter(email=value).exists(): #checks other emails to ensure uniqueness (not themselves)
            raise serializers.ValidationError("This email is used, please use a different one.")
        return value

 
# Serializer for Sport model
class SportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sport
        fields = ['id', 'name']

#Serializer for the LeagueTable Model   
class LeagueTableSerializer(serializers.ModelSerializer):
    sport_name = serializers.CharField(source='sport.name', read_only=True)

    class Meta:
        model = LeagueTable
        fields = ['id', 'name', 'sport', 'sport_name', 'gender']

# Serializer for the Team (find Team)
class TeamSerializer(serializers.ModelSerializer):
    university = UniversitySerializer(read_only=True)
    sport = SportSerializer(read_only=True)
    league = LeagueTableSerializer(read_only=True)
    
    class Meta:
        model = Team
        fields = ["id", "name", "university", "sport", "created_by","league"]

  
# Team Membership Serializer (for viewing teammates, score tracking)
class TeamMembershipSerializer(serializers.ModelSerializer):
    user_full_name = serializers.SerializerMethodField() # Custom field to show full name
    team_name = serializers.CharField(source="team.name", read_only=True) # Get the team's name directly

    class Meta:
        model = TeamMembership
        fields = ["id", "user_full_name","team_name", "position", "goals_scored", "status"]

    def get_user_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
 

# Serializer for listing team members with full name, position, and goals scored
class TeamMemberWithGoalsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    full_name = serializers.CharField()
    position = serializers.CharField(allow_null=True)  # Position can be optional
    goals_scored = serializers.IntegerField()
    is_self = serializers.BooleanField()

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


#Serializer for player Goal Model
class PlayerGoalSerializer(serializers.ModelSerializer):
    player_name = serializers.SerializerMethodField()

    class Meta:
        model = PlayerGoal
        fields = ['user', 'player_name', 'match', 'team', 'goals', 'scored_at']

    def get_player_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
