from django.shortcuts import render
from django.http import HttpResponse, JsonResponse


def index(request):
    request.session.get('name')
    return render(request, 'index.html')
