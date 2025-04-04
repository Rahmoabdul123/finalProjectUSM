from django.urls import path
from . import views
from .views import teams_by_university, request_join_team
urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("teams-by-university/", views.teams_by_university),
    path("sports/", views.list_sports),
    path("join-requests/", views.pending_join_requests),
    path('teams/<int:team_id>/join/', request_join_team),
    path("handle-request/<int:membership_id>/", views.handle_join_request),
    path("pending-join-requests/", views.pending_join_requests, name="pending-join-requests"),
    path("my-teams/", views.my_teams, name="my-teams"),
]