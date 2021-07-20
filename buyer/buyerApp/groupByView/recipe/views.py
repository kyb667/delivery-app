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
from buyerApp import common
from firebase_admin import auth, db

logger = common.getLogger()

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


def getRecipeNames(request, name):
    foodNameList = food.objects.filter(
        foodname__icontains=name).values('foodname')[:10]
    return JsonResponse({'recipenames': list(foodNameList)})


def getRecipeTypes(request):
    recipetypes = food.objects.values(
        'fooddetail').annotate(count=Count('foodname'))
    recipetypes = [dict(i) for i in recipetypes]
    return JsonResponse({'recipetypes': recipetypes})


def select(request):
    """
    get recipe list
    """
    try:
        logger.info("select start")
        recipeList = []
        if request.method == 'GET':
            selectList = request.GET['selectList']
            group = request.GET['group']
            if selectList:
                if group == 'recipetype':
                    recipeList = food.objects.filter(
                        fooddetail=selectList).values()
            # get all recipe
            else:
                recipeList = db.reference('/recipe').get()
                # recipeList = food.objects.all().values()
            recipeList = list(recipeList.values()) if recipeList else recipeList
            return JsonResponse({'data': recipeList})
        else:
            if request.POST['name']:
                valList = recipe.objects.filter(
                    food_name__foodname__icontains=request.POST['name']).values()
                valList = [dict(i) for i in valList]
                print(valList)
            return render(request, 'recipe/gallery.html', {'findList': valList})
    except Exception as e:
        logger.error(e)
        return redirect('index')
    finally:
        logger.info("select end")



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
        recipeid=recipeid).values().first()
    print(recipedetail)
    return JsonResponse({'lovenum': recipedetail['recipelove']})


def addhatenum(request):
    recipeid = request.GET['id']
    recipe.objects.filter(recipeid=recipeid).update(
        recipehate=F('recipehate')+1)
    recipedetail = recipe.objects.filter(
        recipeid=recipeid).values().first()
    return JsonResponse({'hatenum': recipedetail['recipehate']})
