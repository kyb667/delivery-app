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
from .groupByView.user import views as user
# from .board import views as board
from .groupByView.recipe import views as recipe
from .groupByView.order import views as order
from django.urls import path

urlpatterns = [
    path('', views.index, name='index'),

    # user
    path('account/', user.account, name='account'),
    path('login/', user.login, name='login'),
    path('ajax/checkid/', user.checkid, name='checkid'),
    path('signup/', user.signup, name='signup'),
    path('signin/', user.signin, name='signin'),
    path('signout/', user.signout, name='signout'),

    # board
    # path('comment/<int:foodid>/', board.create_comment, name='comment'),

    # comment
    # path('comment/reaction/', board.comment_up, name='comment_up'),

    # recipe
    path('recipe/', recipe.index, name='recipe'),
    path('addlovenum', recipe.addlovenum, name='addlovenum'),
    path('addhatenum', recipe.addhatenum, name='addhatenum'),
    path('recipe/getRecipeNames/<str:name>/',
         recipe.getRecipeNames, name='getRecipeNames'),
    path('recipe/getRecipeTypes/', recipe.getRecipeTypes, name='getRecipeTypes'),
    path('recipe/select', recipe.select, name='select'),
    path('recipe/<str:name>/', recipe.detailRecipe, name='detailRecipe'),
    path('showrecipe/<str:recipename>_<str:id>/',
         recipe.showRecipeDetail, name='showRecipeDetail'),

    # order
    path('order/', order.home, name='order_home'),
    path('cart/', order.cart, name='cart'),
    path('order/requestCode', order.requestCode, name='requestCode'),
    path('order-success', order.order_success, name='order_success'),
    path('order-finish', order.order_finish, name='order_finish'),
    path('order-finish/<str:uid>',
         order.order_finish, name='order_finish'),
    path('order-check', order.order_check, name='order_check'),
    path('order-history', order.order_history, name='order_history'),
    path('order-login-check', order.order_login_check, name='order_login_check'),
    path('get-order-detail', order.get_order_detail, name='get_order_detail'),
]
