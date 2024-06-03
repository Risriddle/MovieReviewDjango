from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import redirect
import json
from rest_framework import status
from .serializers import *
from django.contrib.auth import authenticate  
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from .models import *
from .serializers import *
from rest_framework.viewsets import ModelViewSet

class BearerTokenAuthentication(TokenAuthentication):
    keyword = 'Bearer'


class RegisterUsers(APIView):
    def get(self, request):
        return render(request,"register.html")
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return render(request,'login.html')
         
         
class LoginUsers(APIView): 
     def get(self,request):  
        return render(request,"login.html")
     def post(self,request):
                username = request.data.get('username')
                password = request.data.get('password')
                user = authenticate(username=username, password=password)
                if user is not None:
                    token, _ = Token.objects.get_or_create(user=user)
                    return Response({'token': token.key}, status=status.HTTP_200_OK)
                    #return redirect('success')
                    #return render(request,"success.html",{'token': token.key})
                else:
                    return render(request, 'login.html')


# Inside views.py of your Django app
from django.shortcuts import render
import requests

class MovieReview(APIView):
    def get(self,request):
        print("oooooooooooooooooo")
        return render(request,"success.html")
    def post(self, request):
        api_key = "961f8b8e"
        title = request.data.get("title")
        print(title)
        if not title:
            return JsonResponse({'error_message': 'Please provide a movie title'}, status=400)
        
        url = f"http://www.omdbapi.com/?t={title}&apikey={api_key}"
        response = requests.get(url)
        if response.status_code == 200:
            reviews = MovieRev.objects.filter(movie_title=title).values('review_text', 'user__username', 'rating')
       
            movies = response.json()
            reviews_json = list(reviews)
    
            print(reviews_json)
            return JsonResponse({'movies':movies,'reviews':reviews_json})
        else:
            return JsonResponse({'error_message': 'Failed to fetch movie details'}, status=500)


from .models import MovieRev

class Save_review(APIView):
    authentication_classes = [BearerTokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self,request):
        movie_title = request.data.get('movie_title')
        review_text = request.data.get('review_text')
        rating = request.data.get('rating')
        user = request.user
        print(movie_title,user)
        # Create a new MovieReview object and save it to the database
        movie_review = MovieRev.objects.create(
            user=user,
            movie_title=movie_title,
            review_text=review_text,
            rating=rating
        )

        return JsonResponse({'message': 'Review saved successfully'})
    