from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import bcrypt
import json
from django.views.decorators.csrf import csrf_exempt
from ...models import recipe, member, recipedetail, food
from django.db.models import F, Count
from datetime import datetime
from django.core.serializers.json import DjangoJSONEncoder
from django.template.loader import render_to_string
import requests


def index(request):
    return render(request, 'recipe/gallery.html')


def detailRecipe(request, name):
    if name:
        recipeInfo = recipe.objects.filter(food_name=name).values()
        if recipeInfo:
            recipeInfo = [dict(i) for i in recipeInfo]
            print(recipeInfo)
            return JsonResponse({'recipeInfo': recipeInfo})
        return JsonResponse({'recipeInfo': None})


def getRecipeNames(reqeust, name):
    foodNameList = food.objects.filter(
        foodname__icontains=name).values('foodname')[:10]
    return JsonResponse({'recipenames': list(foodNameList)})


def getRecipeTypes(reqeust):
    recipetypes = food.objects.values(
        'fooddetail').annotate(count=Count('foodname'))
    recipetypes = [dict(i) for i in recipetypes]
    return JsonResponse({'recipetypes': recipetypes})


def select(reqeust):
    if reqeust.method == 'POST':
        selectList = reqeust.POST['selectList']
        group = reqeust.POST['group']
        if selectList:
            if group == 'recipetype':
                recipeList = food.objects.filter(
                    fooddetail=selectList).values()
        else:
            recipeList = food.objects.all().values()
        recipeList = [dict(i) for i in recipeList]
        return JsonResponse({'data': recipeList})


def showRecipeDetail(request, recipename, id):
    info = recipe.objects.filter(recipeid=id).values()
    info = [dict(i) for i in info]
    if info:
        fooddetail = food.objects.filter(
            foodname=info[0]['food_name_id']).values('fooddetail').first()
        recipeDetailInfo = recipedetail.objects.filter(
            recipe_id=id).values().order_by('recipedetailnum')
        recipeDetailInfo = [dict(i) for i in recipeDetailInfo]
        return render(request, 'recipe/detail.html', {'recipeinfo': info[0], 'fooddetail': fooddetail, 'recipeDetailInfo': recipeDetailInfo})