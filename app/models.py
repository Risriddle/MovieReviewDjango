import requests
from django.contrib.auth.models import User
from django.db import models

class MovieRev(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie_title = models.CharField(max_length=255)
    review_text = models.TextField()
    rating = models.IntegerField()

    def __str__(self):
        return f"{self.user.username}'s review for {self.movie_title}"
