from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseNotFound, JsonResponse
from django.db import IntegrityError
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
import uuid
import json

from .models import User, Illustration, Graphic

def index(request):
    if request.user.is_authenticated:
        user = request.user
        illustrations = Illustration.objects.filter(creator=user).order_by("-timestamp")
        illuList = [illu.serialize() for illu in illustrations]
        initialLength = len(illuList)

        # If list longer than 3, don't pass over the additional illustrations
        if len(illuList) > 3:
            del illuList[3:]

        return render(request, "designeditor/index.html", {
            "illustrations": illuList,
            "length": initialLength
        })
        
    else:
        return render(request, "designeditor/index.html")
    
@login_required
def overview(request):
    user = request.user
    illustrations = Illustration.objects.filter(creator=user).order_by("-timestamp")
    list = [illu.serialize() for illu in illustrations]

    return render(request, "designeditor/overview.html", {
        "illustrations": list
    })

def editor(request, uuid):
    # Check if uuid is a uuid
    if is_valid_uuid(uuid) == False:
        return HttpResponseNotFound('<h1>Page not found</h1>')

    html = Illustration.objects.get(id=uuid).html
    name = Illustration.objects.get(id=uuid).name

    return render(request, "designeditor/editor.html", {
        "html": html,
        "name": name
    })

def graphics(request, id):
    if request.method == "GET":

        selectedGraphicData = Graphic.objects.get(name=id).data
        isPerson = selectedGraphicData["person"]

        data = Graphic.objects.filter(data__person=isPerson)
        list = []
        for x in data:
            list.append({
                "id": x.name,
                "html": x.html
            })

        return JsonResponse({"graphics": list}, status=201)

@csrf_exempt
@login_required
def new(request):
    if request.method == "POST":
        data = json.loads(request.body)
        html = data.get("html", "")
        name = data.get("name", "")

        illu = Illustration(
            creator=request.user,
            html=html,
            name=name
        )
        illu.save()

        return JsonResponse({"id": illu.id}, status=201)

@csrf_exempt
@login_required
def update(request, uuid):
    if request.method == "PUT":
        illu = Illustration.objects.get(id=uuid)
        newHTML = json.loads(request.body).get("html", "")
        newName = json.loads(request.body).get("name", "")

        illu.html = newHTML
        illu.name = newName
        illu.save()

        return JsonResponse({"message": "Saved successfully"}, status=201)


def is_valid_uuid(value):
    try:
        uuid.UUID(value)
        return True
    except ValueError:
        return False

def register(request):
    if request.method == "POST":
        email = request.POST["email"]

        # Check if password equals confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "designeditor/register.html", {
                "message": "Passwords must match."
            })

        # Create a new user
        try:
            user = User.objects.create_user(email, password)
            user.save()
        except IntegrityError:
            return render(request, "designeditor/register.html", {
                "message": "Username already taken."
            })
        
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "designeditor/register.html")

def login_view(request):
    if request.method == "POST":
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, email=email, password=password)

        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "designeditor/login.html", {
                "message": "Email or password not correct."
            })
    else:
        return render(request, "designeditor/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))