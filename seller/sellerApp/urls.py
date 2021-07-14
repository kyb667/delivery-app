"""calApp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from . import views
from django.urls import path

urlpatterns = [
    path('login', views.login, name='login'),
    path('signin', views.signin, name='signin'),
    path('getRecipe', views.getRecipe, name='getRecipe'),
    path('getFood', views.getFood, name='getFood'),
    path('insertRecipe', views.insertRecipe, name='insertRecipe'),
    path('getRecipeDetail', views.getRecipeDetail, name='getRecipeDetail'),
    path('insertRecipeDetail', views.insertRecipeDetail, name='insertRecipeDetail'),
    path('getOrderInfo', views.getOrderInfo, name='getOrderInfo'),
    path('deleteRecipe', views.deleteRecipe, name='deleteRecipe'),
    path('updateRecipe', views.updateRecipe, name='updateRecipe'),
    path('getOrderInfoDetail', views.getOrderInfoDetail, name='getOrderInfoDetail'),
    path('send', views.send, name='send'),
]
