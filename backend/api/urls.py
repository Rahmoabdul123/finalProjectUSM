from django.urls import path
from . import views

urlpatterns = [
    # FOR STUDENTS = Getting all teams belong to the user's uni
    path("teams-by-university/", views.TeamsByUniversityView.as_view()),
    #FOR STUDENTS = used to list all sports (filter of finding teams)
    path("sports/", views.ListSportsView.as_view(), name="list-sports"),
    #FOR STUDENTS = used to request to join team
    path('teams/<int:team_id>/join/', views.RequestJoinTeamView.as_view(), name='request-join-team'),

    path("handle-request/<int:membership_id>/", views.HandleJoinRequestView.as_view(), name="handle-join-request"),

    path("pending-join-requests/", views.PendingJoinRequestsView.as_view(), name="pending-join-requests"),  
    
    #FOR STUDENTS = shows Team that user got approved to join
    path("my-teams/", views.MyTeamsView.as_view(), name="my-teams"),

    #Finds Members of your team
    path("teams/<int:team_id>/members/", views.TeamMembersView.as_view(), name="team-members"),
    
    # FOR STUDENTS = Upcoming matches (student dashboard)
    path("my-matches/", views.MyMatchesView.as_view(), name="my-matches"),

    # FOR STUDENTS = Viewing past and future matches in their own team
    path("teams/<int:team_id>/matches/", views.TeamMatchesView.as_view(), name="team-matches"),

    path("matches/<int:match_id>/availability/", views.MatchAvailabilityView.as_view(), name="match-availability"),
    #FOR BOTH = Shows actual ranking of teams
    path("leagues/<int:league_id>/standings/", views.LeagueStandingsView.as_view(), name="league-standings"),
    # FOR BOTH = lists all of the available leagues
    path("leagues/", views.ListLeaguesView.as_view(), name="list-leagues"),
    #find all teams specifically from the univeristy that the admin belongs to
    path("admin/university-teams/", views.AdminUniversityTeamsView.as_view(), name="admin-university-teams"),

    path("matches/<int:match_id>/edit-score/", views.EditMatchScoreView.as_view(), name="edit-match-score"),
    #lists all teammates of that specific team
    path("admin/teams/<int:team_id>/members/", views.AdminTeamMembersView.as_view(), name="admin-team-members"),

    path("admin/matches/<int:match_id>/availability/", views.AdminMatchAvailabilityView.as_view(), name="admin-match-availability"),

    path("admin/matches/<int:match_id>/assign-goals/", views.AssignPlayerGoalsView.as_view()),
    
    #updates User's position in the team
    path("teams/<int:team_id>/update-position/", views.UpdatePlayerPositionView.as_view()),
    
    #Finds top scorer in the team
    path("teams/<int:team_id>/top-scorers/", views.TopTeamScorersView.as_view(), name="top-scorers"),
    
    #Finds Top Scorers in the entire league
    path("leagues/<int:league_id>/top-scorers/", views.TopLeagueScorersView.as_view(), name="league-top-scorers"),

]
