"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, ListUniversitiesView, CustomTokenObtainPairView,ChangePasswordView,UserProfileDetailView
from rest_framework_simplejwt.views import TokenRefreshView
# Code reused from: [Django & React Web App Tutorial - Authentication, Databases, Deployment & More], [Tech with Team], [https://www.youtube.com/watch?v=c-QsfbznSXI]
#  The reused lines are Line 26,27,29,32,33
#  Accessed: [09/03/2025]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", CustomTokenObtainPairView.as_view(), name="get_token"),  
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api/universities/", ListUniversitiesView.as_view(), name="list-universities"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),
    path("api/change-password/",ChangePasswordView.as_view(), name="change-password"),
    path("update-details/", UserProfileDetailView.as_view(), name="update-details"),
]

