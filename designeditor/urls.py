from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("editor/<str:uuid>", views.editor, name="editor"),
    path("new", views.new, name="new"),
    path("editor/<str:uuid>/update", views.update, name="update"),
    path("graphics/<str:id>", views.graphics, name="graphics"),
    path("overview", views.overview, name="overview")
]