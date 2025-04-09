from django.urls import path
from . import views
# from .views import (TeamsByUniversityView, RequestJoinTeamView, HandleJoinRequestView, MyTeamsView, PendingJoinRequestsView, ListSportsView,)

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("teams-by-university/", views.TeamsByUniversityView.as_view()),
    path("sports/", views.ListSportsView.as_view(), name="list-sports"),
    path("join-requests/", views.PendingJoinRequestsView.as_view()),
    path('teams/<int:team_id>/join/', views.RequestJoinTeamView.as_view(), name='request-join-team'),
    path("handle-request/<int:membership_id>/", views.HandleJoinRequestView.as_view(), name="handle-join-request"),
    path("pending-join-requests/", views.PendingJoinRequestsView.as_view(), name="pending-join-requests"),  
    path("my-teams/", views.MyTeamsView.as_view(), name="my-teams"),
    path("teams/<int:team_id>/members/", views.TeamMembersView.as_view(), name="team-members"),
    path("my-matches/", views.MyMatchesView.as_view(), name="my-matches"),
    path("teams/<int:team_id>/matches/", views.TeamMatchesView.as_view(), name="team-matches"),
    path("matches/<int:match_id>/availability/", views.MatchAvailabilityView.as_view(), name="match-availability"),
    path("leagues/<int:league_id>/standings/", views.LeagueStandingsView.as_view(), name="league-standings"),
    path("leagues/", views.ListLeaguesView.as_view(), name="list-leagues"),
    path("admin/university-teams/", views.AdminUniversityTeamsView.as_view(), name="admin-university-teams"),
    path("matches/<int:match_id>/edit-score/", views.EditMatchScoreView.as_view(), name="edit-match-score"),
    path("api/team-matches/<int:team_id>/", views.TeamMatchesView.as_view(), name="team-matches"),

]
