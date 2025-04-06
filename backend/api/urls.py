from django.urls import path
from . import views
from .views import (TeamsByUniversityView, RequestJoinTeamView, HandleJoinRequestView, MyTeamsView, PendingJoinRequestsView, ListSportsView,)

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("teams-by-university/", TeamsByUniversityView.as_view()),
    path("sports/", ListSportsView.as_view(), name="list-sports"),
    path("join-requests/", PendingJoinRequestsView.as_view()),
    path('teams/<int:team_id>/join/', RequestJoinTeamView.as_view(), name='request-join-team'),
    path("handle-request/<int:membership_id>/", HandleJoinRequestView.as_view(), name="handle-join-request"),
    path("pending-join-requests/", PendingJoinRequestsView.as_view(), name="pending-join-requests"),  
    path("my-teams/", MyTeamsView.as_view(), name="my-teams"),
    path("teams/<int:team_id>/members/", views.TeamMembersView.as_view(), name="team-members"),
]
