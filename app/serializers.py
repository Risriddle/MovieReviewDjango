from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

    class Meta:
        model = User
        fields = ['username', 'password']   
        
        
class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieRev
        fields ="__all__"   