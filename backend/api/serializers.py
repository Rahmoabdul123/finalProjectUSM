from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Note
from .models import University


User = get_user_model()  # ✅ Ensure Django uses the custom User model

# ✅ University Serializer (So We Can List Universities)
class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ["id", "name", "location"]

class UserSerializer(serializers.ModelSerializer):
    university = serializers.PrimaryKeyRelatedField(queryset=University.objects.all())
    class Meta:
        model = User
        fields = ["id", "email", "password", "university", "role"]  # ✅ Role is assigned automatically

        extra_kwargs = {
            "password": {"write_only": True},
            "role": {"read_only": True},
        }

    def create(self, validated_data):
        """✅ Uses the properly overridden `create_user()` method"""
        return User.objects.create_user(**validated_data)


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}