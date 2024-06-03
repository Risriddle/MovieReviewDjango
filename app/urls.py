from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import *



urlpatterns = [ 
    path('register/',RegisterUsers.as_view(), name='register-users'),
    path('login/',LoginUsers.as_view(), name='login-users'),
   path('success/',MovieReview.as_view(), name='success'),  # URL pattern for movie_list view
 path('save_review/', Save_review.as_view(), name='save_review')
    
]
