from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import bcrypt
import json
from django.views.decorators.csrf import csrf_exempt
from ..models import recipe, member, recipedetail
from django.db.models import F
from datetime import datetime
from django.core.serializers.json import DjangoJSONEncoder
import requests

galleryNum = 24


def index(request, index=1):
    recipeList = recipe.objects.all().values()[(
        index-1)*galleryNum:galleryNum*(index+9)]
    print(recipeList)
    if recipeList:
        indexNum = int(len(recipeList)/galleryNum)
        maxIndex = indexNum + 1
        minIndex = 1
        # 끝번호
        if indexNum < 10:
            maxIndex = indexNum + index + 1
            minIndex = maxIndex - 10
            return render(request, 'recipe/gallery.html', {'recipeList': recipeList[:galleryNum], 'range': range(minIndex, maxIndex), 'index': index})
        # 나머지번호
        if index >= 6:
            minIndex = index - 4
            maxIndex = index + 6
        return render(request, 'recipe/gallery.html', {'recipeList': recipeList[:galleryNum], 'range': range(minIndex, maxIndex), 'index': index})

    return redirect('index')

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
