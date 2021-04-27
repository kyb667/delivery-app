from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import bcrypt
import json
from django.views.decorators.csrf import csrf_exempt
from ...models import member


def checkid(request):
    memberid = request.GET.get('id', None)
    data = {
        'check': member.objects.filter(id=memberid).exists()
    }
    return JsonResponse(data)


def signup(request):
    if request.method == 'POST':
        body = {}
        body['id'] = request.POST['id']
        pw = request.POST['password']
        body['pw'] = bcrypt.hashpw(
            pw.encode('utf-8'), bcrypt.gensalt()).decode()
        body['name'] = request.POST['name']
        body['email'] = request.POST['email']
        body['postcode'] = int(request.POST['postcode'])
        body['roadAddress'] = request.POST['roadAddress']
        body['jibunAddress'] = request.POST['jibunAddress']
        body['detailAddress'] = request.POST['detailAddress']
        member.objects.create(**body)
        return redirect('index')


def signin(request):
    if request.method == 'POST':
        login_id = request.POST['login_id']
        login_pw = request.POST['login_password']
        user = member.objects.filter(id=login_id).values()
        user = [dict(i) for i in user][0]
        if user and bcrypt.checkpw(login_pw.encode(), user['pw'].encode()):
            request.session['name'] = user['id']
            return redirect('index')
    return render(request, 'account/account_login.html')


def signout(request):
    if request.session.get('name'):
        del request.session['name']
    return redirect('index')


def account(request):
    return render(request, 'account/account_signup.html')


def login(request):
    return render(request, 'account/account_login.html')
