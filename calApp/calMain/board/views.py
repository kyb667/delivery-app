from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import bcrypt
import json
from django.views.decorators.csrf import csrf_exempt
from ..models import comment, member, food
from django.db.models import F
from datetime import datetime
from django.core.serializers.json import DjangoJSONEncoder

galleryNum = 24


def create_comment(request, foodid):
    now = datetime.now()
    if request.method == 'POST':
        user = request.session.get('name')
        if user:
            memb = member.objects.filter(memberid=user).first()
            foodInfo = food.objects.filter(id=foodid).first()
            if memb and foodInfo:
                body = {}
                body['subject'] = food(id=foodid)
                body['writer'] = member(memberid=memb.memberid)
                body['writingtime'] = now.strftime("%Y-%m-%d %H:%M:%S")
                body['comment'] = request.POST['contents']
                body['modify'] = 0
                comment.objects.create(**body)
                # 최신댓글 갱신
                newCommentList = comment.objects.filter(
                    subject=foodid).all().order_by('-writingtime')[:10].values()
                newCommentInfo = []
                for i in newCommentList:
                    i['writingtime'] = i['writingtime'].strftime(
                        "%Y-%m-%d %H:%M:%S")
                    newCommentInfo.append(i)
                newCommentInfo.reverse()
                return HttpResponse(json.dumps({'newCommentInfo': newCommentInfo}, cls=DjangoJSONEncoder), content_type="application/json")
    return redirect('index')


def comment_up(reqeust):
    if reqeust.method == 'POST':
        commentid = reqeust.POST['commentid']
        reaction = reqeust.POST['reaction']
        if reaction == 'commentlove':
            comment.objects.filter(id=commentid).update(
                commentlove=F(reaction)+1)
        else:
            comment.objects.filter(id=commentid).update(
                commenthate=F(reaction)+1)
        commendInfo = comment.objects.filter(id=commentid).first()
        info = commendInfo.commentlove if reaction == 'commentlove' else commendInfo.commenthate
    return JsonResponse({'data': info})
