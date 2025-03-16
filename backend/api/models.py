from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, university=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        if not university:
            raise ValueError("University is required")

        email = self.normalize_email(email)
        extra_fields.pop("username", None)  # 🚀 Remove unexpected `username`

        # ✅ Automatically assign "Admin" role if first user from that university
        user_count = User.objects.filter(university=university).count()
        extra_fields.setdefault("role", "Admin" if user_count == 0 else "Student")

        user = self.model(email=email, university=university, **extra_fields)
        user.set_password(password)  # ✅ Hash password
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)

class University(models.Model):
    name = models.CharField(max_length=255, unique=True)
    location = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name

class User(AbstractUser):
    username = None  # ✅ Remove username field
    email = models.EmailField(unique=True)  # ✅ Use email instead

    ROLE_CHOICES = (("Admin", "Admin"), ("Student", "Student"))
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="Student")

    university = models.ForeignKey(University, on_delete=models.CASCADE, related_name="users")

    USERNAME_FIELD = "email"  # ✅ Use email instead of username
    REQUIRED_FIELDS = []  # ✅ No need for username

    objects = CustomUserManager()  # ✅ Assign custom manager

    def __str__(self):
        return f"{self.email} ({self.role} - {self.university.name})"


# ✅ Test Model (Optional: You Can Use This for Testing Redirection)
class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title

