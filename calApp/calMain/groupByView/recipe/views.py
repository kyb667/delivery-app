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
            for i in recipeInfo:
                recipeInfo = [dict(i) for i in recipeInfo]
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
    selectList = reqeust.GET['selectList']
    group = reqeust.GET['group']
    print(selectList)
    print(group)
    if selectList:
        if group == 'recipetype':
            recipeList = food.objects.filter(
                fooddetail=selectList).values()
    else:
        recipeList = food.objects.all().values()
    recipeList = [dict(i) for i in recipeList]
    return JsonResponse({'data': recipeList})


def showRecipeDetail(request, recipename, id):
    info = recipedetail.objects.select_related(
        'recipe_id').filter(recipe_id=id).order_by('recipedetailnum')
    if info:
        recipeInfo = {}
        foodDetail = None
        recipeDetailInfo = []
        for i in info:
            foodDetail = i.recipe_id.food_name.fooddetail if foodDetail is None else foodDetail
            recipeInfo = i.recipe_id.__dict__ if not recipeInfo else recipeInfo
            recipeDetailInfo.append(i.__dict__)
        return render(request, 'recipe/detail.html', {'fooddetail': foodDetail, 'recipeinfo': recipeInfo, 'recipedetailinfo': recipeDetailInfo})


def addlovenum(request):
    recipeid = request.GET['id']
    recipe.objects.filter(recipeid=recipeid).update(
        recipelove=F('recipelove')+1)
    recipedetail = recipe.objects.filter(
        recipeid=recipeid).values()
    recipedetail = recipedetail.__dict__
    print(recipedetail)
    return JsonResponse({'lovenum': recipedetail['recipelove']})


def addhatenum(request):
    recipeid = request.GET['id']
    recipe.objects.filter(recipeid=recipeid).update(
        recipehate=F('recipehate')+1)
    recipedetail = recipe.objects.filter(
        recipeid=recipeid).values()
    recipedetail = recipedetail.__dict__
    return JsonResponse({'hatenum': recipedetail['recipehate']})


def getTopthree(request):
    threeVal = recipe.objects.select_related(
        'recipeid').values().order_by('-recipelove')[:3]
    threeList = []
    for i in threeVal:
        threeList.append(i)
    return JsonResponse({'threeList': threeList})
