from django.shortcuts import render
from django.http import HttpResponse, JsonResponse


def index(request):
    user = request.session.get('name')
    if user:
        print(user)
    else:
        print('None')
    return render(request, 'index.html')


def account(request):
    return render(request, 'account/account_signup.html')


def login(request):
    return render(request, 'account/account_login.html')
