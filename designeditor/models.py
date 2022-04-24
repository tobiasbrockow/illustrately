from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

from .managers import CustomUserManager


class User(AbstractUser):
    username = None
    email = models.EmailField('email address', unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class Illustration(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    html = models.TextField()
    creator = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="creator")
    timestamp = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=100)

    def serialize(self):
        return {
            "id": str(self.id),
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "html": self.html,
            "name": self.name
        }


class Graphic(models.Model):
    html = models.TextField()
    name = models.CharField(max_length=100)
    data = models.JSONField(null=True)
