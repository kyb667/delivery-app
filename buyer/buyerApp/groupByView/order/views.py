from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import bcrypt
import json
from ...models import order_info, order_detail, member, recipe
from ... import common
from datetime import datetime
import time
import string
import random
from django.views.decorators.csrf import csrf_exempt

checkCode = common.IDENTIFICATION_CODE


def home(request):
    return render(request, 'order/order_request.html')


def cart(request):
    return render(request, 'order/order_cart.html')


def order_check(request):
    return render(request, 'order/order_check.html')


def order_finish(request, uid):
    idList = order_detail.objects.filter(id_uid=uid).values('recipe_id')
    idList = [i['recipe_id'] for i in list(idList)]
    sellerList = recipe.objects.filter(recipeid__in=idList).values('seller_id')
    sellerList = [i['seller_id'] for i in list(sellerList)]
    return render(request, 'order/order_finish.html', {'uid': uid, 'val': sellerList})


def requestCode(request):
    return JsonResponse({'code': checkCode})


def order_success(request):
    if request.method == 'POST':
        orderInfo = json.loads(request.POST['returnVal'])
        cartList = json.loads(request.POST['cart'])[0]
        user = json.loads(request.POST['id'])['member_id']
        order_dict = json.loads(request.POST['order_dict'])
        insertList = []
        money = 0
        insert_order = {'id_uid': orderInfo["imp_uid"],
                        'product_uid': orderInfo["merchant_uid"],
                        'member_id': user,
                        'order_password': bcrypt.hashpw(order_dict['order_password'].encode('utf-8'), bcrypt.gensalt()).decode(),
                        'pay': orderInfo["pay_method"],
                        'order_money': money,
                        'order_email': order_dict["order_email"],
                        'order_phone': order_dict["order_phone"],
                        'order_postcode': order_dict["order_postcode"],
                        'order_roadAddress': order_dict["order_roadAddress"],
                        'order_detailAddress': order_dict["order_detailAddress"]}
        order_info.objects.create(**insert_order)
        for num, cart in cartList.items():
            money += int(cart["money"].split(' ')[0])
            insert_order_product = {'id_uid': order_info(orderInfo["imp_uid"]),
                                    'product_uid': orderInfo["merchant_uid"],
                                    'member_id': user,
                                    'recipe_id': recipe(recipeid=num),
                                    'count': cart["cnt"],
                                    'price': cart['price'],
                                    'ordertime': datetime.now(),
                                    'updatetime': datetime.now()}
            insertList.append(order_detail(**insert_order_product))
        order_detail.objects.bulk_create(insertList)
        return JsonResponse({'member_id': user[:]})


def order_history(request):
    if request.method == 'POST':
        if request.session.get('name'):
            if request.session.get('name') == request.POST['id']:
                pw = member.objects.filter(
                    id=request.session.get('name')).values('pw').first()
                if pw and bcrypt.checkpw(request.POST['pw'].encode(), pw['pw'].encode()):
                    info = order_info.objects.filter(
                        member_id=request.session.get('name')).values()
                    info = [dict(i) for i in info]
                    return render(request, 'order/order_notice.html', {'orderList': info})
        else:
            if 'num' in request.POST:
                uuid = request.POST['num']
                info = order_info.objects.filter(id_uid=uuid).values()
                info = [dict(i) for i in info]
                return render(request, 'order/order_notice.html', {'orderList': info})
            elif ('member_id' in request.POST) and ('pw' in request.POST):
                member_id = request.POST['member_id']
                pw = member.objects.filter(
                    id=member_id).values('pw').first()
                if pw and bcrypt.checkpw(request.POST['pw'].encode(), pw['pw'].encode()):
                    info = order_info.objects.filter(
                        member_id=member_id).values()
                    info = [dict(i) for i in info]
                    return render(request, 'order/order_notice.html', {'orderList': info})
                else:
                    info = order_info.objects.filter(
                        member_id=member_id).values()
                    info = [dict(i) for i in info][0]
                    if info and bcrypt.checkpw(request.POST['pw'].encode(), info['order_password'].encode()):
                        info.pop('order_password')
                    return render(request, 'order/order_notice.html', {'orderList': info})


def order_login_check(request):
    print(1)
    user = request.session.get('name')
    randomid = ''.join(map(str, [random.choice(
        string.ascii_letters) for i in range(5)]))
    now = str(int(datetime.now().timestamp() * 1000))
    user = user if user else randomid+'_' + now
    print(user)
    return JsonResponse({'name': user})


def get_order_detail(request):
    id = request.GET.get('id', None)
    orderDetailList = order_detail.objects.select_related(
        'id_uid', 'recipe_id').filter(id_uid=id)
    returnList = []
    for i in orderDetailList:
        body = {}
        body['id_uid'] = i.id_uid.id_uid
        body['member_id'] = i.member_id
        body['recipename'] = i.recipe_id.recipename
        body['foodname'] = i.recipe_id.food_name.foodname
        body['recipe_id'] = i.recipe_id.recipeid
        body['price'] = i.recipe_id.price
        body['count'] = i.count
        body['ordertime'] = i.ordertime
        print(body)
        returnList.append(body)
    return JsonResponse({'orderDetailList': returnList})
