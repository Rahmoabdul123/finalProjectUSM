from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, university=None, first_name=None, last_name=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        if not university:
            raise ValueError("University is required")
        if not first_name or not last_name:
            raise ValueError("First name and Last name are required")

        email = self.normalize_email(email)
        extra_fields.pop("username", None)

        
        user_count = User.objects.filter(university=university).count()
        extra_fields.setdefault("role", "Admin" if user_count == 0 else "Student")

        user = self.model(
            email=email,
            university=university,
            first_name=first_name,
            last_name=last_name,
            **extra_fields
        )
        user.set_password(password)
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
    username = None  
    email = models.EmailField(unique=True) 
    first_name = models.CharField(max_length=50)  
    last_name = models.CharField(max_length=50)   

    ROLE_CHOICES = (("Admin", "Admin"), ("Student", "Student"))
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="Student")

    university = models.ForeignKey(University, on_delete=models.CASCADE, related_name="users")

    USERNAME_FIELD = "email"  
    REQUIRED_FIELDS = ["first_name", "last_name"]  

    objects = CustomUserManager() 

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.role} - {self.university.name})"



#testing
class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title
    
class Sport(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Team(models.Model):
    name = models.CharField(max_length=100)
    university = models.ForeignKey(University, on_delete=models.CASCADE, related_name="teams")
    sport = models.ForeignKey(Sport, on_delete=models.CASCADE, related_name="teams")
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.name} - {self.sport.name} ({self.university.name})"

class TeamMembership(models.Model): #Approval status
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Approved", "Approved"),
        ("Rejected", "Rejected"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="team_memberships")
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="members")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Pending")
    position = models.CharField(max_length=50, blank=True)
    goals_scored = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user} -> {self.team} ({self.status})"
    
class Meta:
    unique_together = ('user', 'team') # ensure they don't request the same team more than once.


