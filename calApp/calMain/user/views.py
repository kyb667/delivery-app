from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import bcrypt
import json
from django.views.decorators.csrf import csrf_exempt
from ..models import member


def checkid(request):
    memberid = request.GET.get('memberid', None)
    data = {
        'check': member.objects.filter(memberid=memberid).exists()
    }
    return JsonResponse(data)


def signup(request):
    if request.method == 'POST':
        body = {}
        body['memberid'] = request.POST['id']
        pw = request.POST['password']
        body['memberpw'] = bcrypt.hashpw(
            pw.encode('utf-8'), bcrypt.gensalt()).decode()
        body['membername'] = request.POST['name']
        body['membergender'] = request.POST['sex']
        body['memberemail'] = request.POST['email']
        body['memberbirth'] = request.POST['date']
        body['memberheight'] = int(request.POST['height'])
        body['memberweight'] = int(request.POST['weidth'])
        member.objects.create(**body)
        return render(request, 'index.html')


def signin(request):
    if request.method == 'POST':
        login_id = request.POST['login_id']
        login_pw = request.POST['login_password']
        user = member.objects.filter(memberid=login_id).values()
        user = [dict(i) for i in user][0]
        print(user)
        if user and bcrypt.checkpw(login_pw.encode(), user['memberpw'].encode()):
            request.session['name'] = user['memberid']
            return redirect('index')
    return render(request, 'account/account_login.html')


def signout(request):
    if request.session.get('name'):
        del request.session['name']
    return redirect('index')
