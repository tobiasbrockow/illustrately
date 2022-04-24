from django.contrib import admin
from .models import User, Illustration, Graphic

# Register your models here.
admin.site.register(Illustration)
admin.site.register(Graphic)
admin.site.register(User)