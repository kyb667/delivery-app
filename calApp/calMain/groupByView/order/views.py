from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import bcrypt
import json
from ... import common
from django.views.decorators.csrf import csrf_exempt

checkCode = common.IDENTIFICATION_CODE


def home(request):
    return render(request, 'order/order_home.html')


def requestCode(request):
    return JsonResponse({'code': checkCode})
