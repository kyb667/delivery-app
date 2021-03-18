from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import bcrypt
import json
from django.views.decorators.csrf import csrf_exempt
from ..models import recipe, member, recipedetail
from django.db.models import F, Count
from datetime import datetime
from django.core.serializers.json import DjangoJSONEncoder
import requests

galleryNum = 16


def index(request, pages=1):
    recipeList = recipe.objects.all().values()[(
        pages-1)*galleryNum:galleryNum*(pages+9)]

    recipegroups = recipe.objects.values(
        'recipegroup').annotate(count=Count('recipeid'))
    recipegroups = [dict(i) for i in recipegroups]
    if recipeList:
        indexNum = int(len(recipeList)/galleryNum)
        maxIndex = indexNum + 1
        minIndex = 1
        # 끝번호
        if indexNum < 10:
            maxIndex = indexNum + pages + 1
            minIndex = maxIndex - 10
            return render(request, 'recipe/gallery.html', {'recipeList': recipeList[:galleryNum], 'range': range(minIndex, maxIndex), 'index': pages, 'recipegroups': recipegroups})
        # 나머지번호
        if pages >= 6:
            minIndex = pages - 4
            maxIndex = pages + 6
        return render(request, 'recipe/gallery.html', {'recipeList': recipeList[:galleryNum], 'range': range(minIndex, maxIndex), 'index': pages, 'recipegroups': recipegroups})

    return redirect('index')


def getRecipeGroups(reqeust):
    recipegroups = recipe.objects.values(
        'recipegroup').annotate(count=Count('recipeid'))
    recipegroups = [dict(i) for i in recipegroups]
    return JsonResponse({'recipegroups': recipegroups})


def getRecipeLevels(reqeust):
    recipelevel = recipe.objects.values(
        'recipelevel').annotate(count=Count('recipeid'))
    recipelevel = [dict(i) for i in recipelevel]
    return JsonResponse({'recipelevel': recipelevel})


def getRecipeTypes(reqeust):
    recipetypes = recipe.objects.values(
        'recipetype').annotate(count=Count('recipeid'))
    recipetypes = [dict(i) for i in recipetypes]
    return JsonResponse({'recipetypes': recipetypes})


def getRecipeTimes(reqeust):
    recipecookingtime = recipe.objects.values(
        'recipecookingtime').annotate(count=Count('recipeid'))
    recipecookingtime = [dict(i) for i in recipecookingtime]
    return JsonResponse({'recipecookingtime': recipecookingtime})


def select(reqeust):
    if reqeust.method == 'POST':
        print(reqeust.POST)
        selectList = reqeust.POST['selectList']
        group = reqeust.POST['group']
        print(selectList)
        print(group)
        a = recipe.objects.filter(recipegroup__in=group)
        print(a)
    return JsonResponse({'data': None})

    # url = 'http://211.237.50.150:7080/openapi/6afee659d62f1611245ada0ea9202bdb65c62ba8ab3e0b995e70398bd8268acd/json/Grid_20150827000000000226_1/1001/2000'
    # response = requests.get(url)
    # print(response.status_code)
    # recipeInfo = json.loads(response.text)
    # print(recipeInfo)
    # recipeInfo = recipeInfo['Grid_20150827000000000226_1']['row']
    # for i in recipeInfo:
    #     body = {}
    #     body['recipename'] = i['RECIPE_NM_KO']
    #     body['recipesummary'] = i['SUMRY']
    #     body['recipegroup'] = i['NATION_NM']
    #     body['recipetype'] = i['TY_NM']
    #     body['recipecookingtime'] = i['COOKING_TIME']
    #     body['recipecal'] = i['CALORIE']
    #     body['recipeservings'] = i['QNT']
    #     body['recipelevel'] = i['LEVEL_NM']
    #     body['recipeirdntcode'] = i['IRDNT_CODE']
    #     body['price'] = i['PC_NM']
    #     body['recipeimage'] = i['IMG_URL']
    #     body['writer'] = member(memberid='abc1')

    #     recipe.objects.create(**body)

    # 세부 레시피
    # url = 'http://211.237.50.150:7080/openapi/6afee659d62f1611245ada0ea9202bdb65c62ba8ab3e0b995e70398bd8268acd/json/Grid_20150827000000000228_1/2001/3000'
    # response = requests.get(url)
    # recipeInfo = json.loads(response.text)
    # print(response.status_code)
    # print(len(recipeInfo))
    # print(recipeInfo)
    # recipeInfo = recipeInfo['Grid_20150827000000000228_1']['row']
    # for i in recipeInfo:
    #     body = {}
    #     body['recipedetailid'] = recipe(recipeid=i['RECIPE_ID'])
    #     body['recipedetailnum'] = i['COOKING_NO']
    #     body['recipedetailtext'] = i['COOKING_DC']
    #     body['recipedetailimage'] = i['STRE_STEP_IMAGE_URL']
    #     body['recipedetailtip'] = i['STEP_TIP']

    #     recipedetail.objects.create(**body)

    # return render(request, 'base.html')
