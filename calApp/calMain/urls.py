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
from .user import views as user
from .food import views as food
from .board import views as board
from .recipe import views as recipe
from django.urls import path

urlpatterns = [
    path('', views.index, name='index'),
    path('account/', views.account, name='account'),
    path('login/', views.login, name='login'),

    # user
    path('ajax/checkid/', user.checkid, name='checkid'),
    path('signup/', user.signup, name='signup'),
    path('signin/', user.signin, name='signin'),
    path('signout/', user.signout, name='signout'),

    # food
    path('food/', food.gal, name='food'),
    # 음식 페이징
    path('food/<int:index>/', food.gal, name='food'),
    # 음식 세부
    path('food/detail/<int:foodnum>/', food.detail, name='fooddetail'),
    # 음식 좋아요 싫어요
    path('food/detail/getlovenum/<int:foodnum>/',
         food.getlovenum, name='getlovenum'),

    # board
    # 음식 댓글 추가
    path('comment/<int:foodid>/', board.create_comment, name='comment'),
    # 댓글 좋아요 싫어요
    path('comment/reaction/', board.comment_up, name='comment_up'),

    # 대댓글 기능

    # 마이페이지

    # 도시락 레시피
    path('recipe/', recipe.index, name='recipe'),
    path('recipe/getRecipeGroups/', recipe.getRecipeGroups, name='getRecipeGroups'),
    path('recipe/getRecipeTimes/', recipe.getRecipeTimes, name='getRecipeTimes'),
    path('recipe/getRecipeLevels/', recipe.getRecipeLevels, name='getRecipeLevels'),
    path('recipe/getRecipeTypes/', recipe.getRecipeTypes, name='getRecipeTypes'),
    path('recipe/select/', recipe.select, name='select'),


    # 다이어트 식품 파는 곳


]
