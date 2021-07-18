from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import bcrypt
import json
from django.views.decorators.csrf import csrf_exempt
from buyerApp import common
from ...models import member
import requests
from firebase_admin import auth, db

logger = common.getLogger()

# def checkid(request):
#     memberid = request.GET.get('id', None)
#     data = {
#         'check': member.objects.filter(id=memberid).exists()
#     }
#     return JsonResponse(data)

def signup(request):
    """
    signup
    """
    try:
        logger.info("signup start")
        if request.method == 'POST':
            body = {}
            body['id'] = request.POST['id']
            pw = request.POST['password']
            body['pw'] = bcrypt.hashpw(
                pw.encode('utf-8'), bcrypt.gensalt()).decode()
            body['name'] = request.POST['name']
            body['email'] = request.POST['email']
            body['postcode'] = int(request.POST['postcode'])
            body['roadaddress'] = request.POST['roadAddress']
            body['jibunaddress'] = request.POST['jibunAddress']
            body['detailaddress'] = request.POST['detailAddress']
            try:
                url="https://identitytoolkit.googleapis.com/v1/accounts:signUp?{0}".format(common.FIREBASE.apiKey)
                data={"email":body['email'], "password":body['pw'], "returnSecureToken": True}
                res = requests.post(url=url, data=data, headers={'Content-Type': 'application/json'})
                res_json = json.loads(res.text)
                if (res_json.code != 200):
                    raise
                else:
                    url = "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key={0}".format(common.FIREBASE.apiKey)
                    data={"requestType":"VERIFY_EMAIL", "idToken":res_json.idToken}
                    res = requests.post(url=url, data=data, headers={'Content-Type': 'application/json'})
                    db.reference('/buyer/'+body['id']+'/info').set(body)
            except Exception as e:
                raise
            # member.objects.create(**body)
    except Exception as e:
        logger.error(e)
    finally:
        logger.info("signup end")
        return redirect('index')

def signin(request):
    """
    signin
    """
    try:
        logger.info("signin start")
        if request.method == 'POST':
            login_id = request.POST['login_id']
            login_pw = request.POST['login_password']
            userInfo = db.reference('/buyer/'+login_id+'/info').get()
            auth.generate_email_verification_link(userInfo['email'], action_code_settings=None)
            if (auth.get_user_by_email(userInfo['email']) \
                and auth.get_user_by_email(userInfo['email'])._data.emailVerified\
                and bcrypt.checkpw(login_pw.encode(), userInfo['pw'].encode())):
                auth.sign(auth.Auth.Persistence.NONE)
                print(userInfo)
            # user = member.objects.filter(id=login_id).values()
            # user = [dict(i) for i in user][0]
            # if user and bcrypt.checkpw(login_pw.encode(), user['pw'].encode()):
            #     request.session['name'] = user['id']
            #     return redirect('index')
        
    except Exception as e:
        logger.error(e)
    finally:
        logger.info("signin end")
        return render(request, 'account/account_login.html')

def signout(request):
    if request.session.get('name'):
        del request.session['name']
    return redirect('index')

def account(request):
    return render(request, 'account/account_signup.html')

def login(request):
    return render(request, 'account/account_login.html')
