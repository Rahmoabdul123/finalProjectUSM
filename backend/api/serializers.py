from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Note, University

User = get_user_model()  

# ✅ University Serializer
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
