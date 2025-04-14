from django.urls import path
from . import views

urlpatterns = [
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
    path("admin/teams/<int:team_id>/members/", views.AdminTeamMembersView.as_view(), name="admin-team-members"),
    path("admin/matches/<int:match_id>/availability/", views.AdminMatchAvailabilityView.as_view(), name="admin-match-availability"),
    path("admin/matches/<int:match_id>/assign-goals/", views.AssignPlayerGoalsView.as_view()),
    path("teams/<int:team_id>/update-position/", views.UpdatePlayerPositionView.as_view()),
    path("teams/<int:team_id>/top-scorers/", views.TopTeamScorersView.as_view(), name="top-scorers"),
    path("leagues/<int:league_id>/top-scorers/", views.TopLeagueScorersView.as_view(), name="league-top-scorers"),

]
