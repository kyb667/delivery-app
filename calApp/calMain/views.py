from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import order_detail, recipe, recipedetail
from django.db.models import F, Count


def index(request):
    request.session.get('name')
    return render(request, 'index.html')


def getTopthree(request):
    threeVal = order_detail.objects.values(
        'recipe_id').annotate(count=Count('recipe_id')).order_by('-count')[:3]
    threeList = []
    for i in threeVal:
        val = recipe.objects.filter(recipeid=i['recipe_id']).values()
        valdict = [dict(i) for i in val]
        threeList.append(valdict)
    return JsonResponse({'threeList': threeList})


def getPopularProdect(request):
    popular = recipe.objects.values().order_by('-recipelove').first()
    valList = []
    val = recipedetail.objects.filter(
        recipe_id=popular['recipeid']).values().order_by('recipedetailnum')
    valList.append([dict(i) for i in val])
    return JsonResponse({'popular': popular, 'valList': valList})
