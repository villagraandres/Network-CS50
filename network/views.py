from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator

import json

from .models import User,Post

def index(request):
    posts=Post.objects.all().order_by("-id");
    paginator=Paginator(posts,10);
    page_number=request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    return render(request, "network/index.html",{"page_obj":page_obj,"title":"Feed"})


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@csrf_exempt
@login_required
def post(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    data=json.loads(request.body);
    content=data.get("content","");
    postId=data.get("id","");

    if postId != '':
        post=Post.objects.get(id=postId);
        post.content=content
        post.save()
        return JsonResponse({"message": "OK"}, status=201)


       


    if content == '':
         return JsonResponse({"error": "POST request required."}, status=400)
    

    new=Post(user=request.user,content=content)
    new.save()

    return JsonResponse({"message": "Created succesfully."}, status=201)

@csrf_exempt
@login_required
def like(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    data=json.loads(request.body);
    postId=data.get("id","");
    current_post=Post.objects.get(id=postId);


    user_has_liked = current_post.likes.filter(id=request.user.id).exists()

    if(user_has_liked):
        current_post.likes.remove(request.user)
    else:
        current_post.likes.add(request.user)    
    

    return JsonResponse({"status": user_has_liked}, status=201)

@login_required
def following(request):
    # Obtener los usuarios a los que sigue el usuario actual
    following = request.user.following.all()
    # Obtener los posts de los usuarios a los que sigue el usuario actual
    posts = Post.objects.filter(user__in=following)
    
    
    
    paginator=Paginator(posts,10);
    page_number=request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    return render(request, "network/index.html",{"page_obj":page_obj,"title":"Following"})

@login_required
def profile(request,id):
      profile=User.objects.get(id=id);
      posts=profile.posts.all().order_by('-date')
      paginator=Paginator(posts,10);
      page_number=request.GET.get("page")
      page_obj = paginator.get_page(page_number)
      
      return render(request, "network/profile.html",{"profile":profile,"page_obj":page_obj})

@csrf_exempt
@login_required
def follow(request):
    if request.method != 'POST':
        return JsonResponse({'error':"Only POST request"},status=404)
    data=json.loads(request.body);
    userId=data.get("id","");
    user=User.objects.get(id=userId);
    
    if user in request.user.following.all():
        request.user.following.remove(user)
        return JsonResponse({"message":"Unfollowed"})
    else:
        request.user.following.add(user)
        return JsonResponse({"message":"Followed"})
   
@csrf_exempt
@login_required
def delete(request):
     if request.method != 'POST':
        return JsonResponse({'error':"Only POST request"},status=404)
     data=json.loads(request.body)
     postId=data.get("id","");
     post=Post.objects.get(id=postId);
     post.delete()   


     return JsonResponse({"message":"deleted"})
   
    