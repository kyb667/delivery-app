from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import bcrypt
import json
from django.views.decorators.csrf import csrf_exempt
from buyerApp import common
from ...models import member
from datetime import datetime, timedelta
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
                url=common.SIGNUP.format(common.FIREBASE_KEY)
                data=json.dumps({'email':body['email'], 'password':body['pw'], 'returnSecureToken': True})
                res = requests.post(url=url, data=data, headers={'Content-type': 'application/json'})
                res_json = json.loads(res.text)
                if 'error' in res_json:
                    logger.error("code : " + str(res_json['error']['code']) + str(res_json['error']['message']))
                    return redirect('account')
                else:
                    url = common.SENDOOBCODE.format(common.FIREBASE_KEY)
                    data=json.dumps({"requestType":"VERIFY_EMAIL", "idToken":res_json['idToken']})
                    try:
                        res = requests.post(url=url, data=data, headers={'Content-Type': 'application/json'})
                        res_json = json.loads(res.text)
                        if 'error' in res_json:
                            logger.error("code : " + str(res_json['error']['code']) + str(res_json['error']['message']))
                            return redirect('account')
                        else:
                            db.reference('/buyer/'+body['id']+'/info').set(body)
                            return redirect('index')
                    except Exception as e:
                        raise
            except Exception as e:
                raise
            # member.objects.create(**body)
    except Exception as e:
        logger.error(e)
    finally:
        logger.info("signup end")

def signin(request):
    """
    signin
    """
    try:
        logger.info("signin start")
        response = redirect('index')
        if request.method == 'POST':
            login_id = request.POST['login_id']
            login_pw = request.POST['login_password']
            userInfo = db.reference('/buyer/'+login_id+'/info').get()
            if (auth.get_user_by_email(userInfo['email']) \
                and auth.get_user_by_email(userInfo['email']).__dict__['_data']['emailVerified']\
                and bcrypt.checkpw(login_pw.encode(), userInfo['pw'].encode())):
                try:
                    url = common.SIGNIN.format(common.FIREBASE_KEY)
                    data=json.dumps({"email":userInfo['email'], "password":userInfo['pw'], "returnSecureToken": True})
                    res = requests.post(url=url, data=data, headers={'Content-Type': 'application/json'})
                    res_json = json.loads(res.text)
                    if 'error' in res_json:
                        logger.error("code : " + str(res_json['error']['code']) + str(res_json['error']['message']))
                        response = redirect('index')
                    else:
                        # "localId": "ZY1rJK0eYLg...",인증된 사용자의 uid입니다.
                        # "email": "[user@example.com]",인증된 사용자의 이메일입니다.
                        # "displayName": "",
                        # "idToken": "[ID_TOKEN]",인증된 사용자의 Identity Platform ID 토큰입니다.
                        # "registered": true,이메일이 기존 계정용인지 여부입니다.
                        # "refreshToken": "[REFRESH_TOKEN]",인증된 사용자의 Identity Platform 갱신 토큰입니다.
                        # "expiresIn": "3600" ID 토큰이 만료될 때까지 남은 시간(초)입니다.
                        uid = res_json["localId"]
                        user = auth.get_user(uid)
                        if user:
                            expires_in = timedelta(days=1)
                            expires = datetime.now() + expires_in
                            session_cookie = auth.create_session_cookie(res_json['idToken'], expires_in=expires_in)
                            response = redirect('index')
                            response.set_cookie('session', session_cookie, expires=expires, httponly=True)
                            logger.info("signin success : " + str(user))
                        else:
                            raise
                except:
                    raise
            else:
                if not (auth.get_user_by_email(userInfo['email'])):
                    logger.error('login되어있지않음')
                else:
                    if not(auth.get_user_by_email(userInfo['email']).__dict__['_data']['emailVerified']):
                        logger.error('email인증필요')
                    if not bcrypt.checkpw(login_pw.encode(), userInfo['pw'].encode()):
                        logger.error('id, pw가 일치하지 않음')
                response = render(request, 'account/account_login.html')
            # user = member.objects.filter(id=login_id).values()
            # user = [dict(i) for i in user][0]
            # if user and bcrypt.checkpw(login_pw.encode(), user['pw'].encode()):
            #     request.session['name'] = user['id']
            #     return redirect('index')
        
    except Exception as e:
        logger.error(e)
        response = render(request, 'account/account_login.html')
    finally:
        logger.info("signin end")
        return response

def signout(request):
    response = redirect('index')
    if request.COOKIES.get('session'):
        response.delete_cookie('session')
    return response

def account(request):
    return render(request, 'account/account_signup.html')

def login(request):
    return render(request, 'account/account_login.html')
