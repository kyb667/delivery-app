from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import bcrypt
import json
from django.views.decorators.csrf import csrf_exempt
from ..models import food, food_detail, comment
from django.db.models import F
from datetime import datetime

galleryNum = 24
commentNum = 10


def gal(request, index=1):
    foodList = food.objects.all().order_by(
        'id')[(index-1)*galleryNum:galleryNum*(index+9)]
    if foodList:
        indexNum = int(len(foodList)/galleryNum)
        maxIndex = indexNum + 1
        minIndex = 1
        # 끝번호
        if indexNum < 10:
            maxIndex = indexNum + index + 1
            minIndex = maxIndex - 10
            return render(request, 'food/gallery.html', {'foodList': foodList[:galleryNum], 'range': range(minIndex, maxIndex), 'index': index})
        # 나머지번호
        if index >= 6:
            minIndex = index - 4
            maxIndex = index + 6
        return render(request, 'food/gallery.html', {'foodList': foodList[:galleryNum], 'range': range(minIndex, maxIndex), 'index': index})

    return redirect('index')


def detail(request, foodnum):
    # 음식정보
    foodInfo = food.objects.filter(id=foodnum).values()
    foodInfo = [dict(i) for i in foodInfo][0]
    foodname = foodInfo.pop('foodname')
    foodid = foodInfo.pop('id')

    # 음식상세
    fooddetail = food_detail.objects.filter(
        fooddetail__id=foodnum).select_related().values()
    fooddetail = [dict(i) for i in fooddetail][0]

    # 베스트댓글
    popularList = comment.objects.filter(
        subject=foodnum, commentlove__gte=5).all().order_by('-commentlove', 'writingtime')[:5].values()
    popularInfo = []
    for i in popularList:
        i['writingtime'] = i['writingtime'].strftime("%Y-%m-%d %H:%M:%S")
        popularInfo.append(i)

    # 최신댓글
    newCommentList = comment.objects.filter(
        subject=foodnum).all().order_by('-writingtime')[:10].values()
    newCommentInfo = []
    for i in newCommentList:
        i['writingtime'] = i['writingtime'].strftime("%Y-%m-%d %H:%M:%S")
        newCommentInfo.append(i)
    newCommentInfo.reverse()
    return render(request, 'food/detail.html', {'foodname': foodname,
                                                'foodinfo': foodInfo,
                                                'foodid': foodid,
                                                'fooddetail': fooddetail,
                                                'popularList': popularInfo,
                                                'newCommentList': newCommentInfo,
                                                'commentNum': commentNum})


def getlovenum(request, foodnum):
    food_detail.objects.filter(fooddetail__id=foodnum).update(
        foodlove=F('foodlove')+1)
    fooddetail = food_detail.objects.filter(
        fooddetail__id=foodnum).select_related().values()
    fooddetail = [dict(i) for i in fooddetail][0]
    return JsonResponse({'lovenum': fooddetail['foodlove']})
