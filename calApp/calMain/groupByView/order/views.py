from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import bcrypt
import json
from ...models import order, order_info
from ... import common
from datetime import datetime
import time
import string
import random
from django.views.decorators.csrf import csrf_exempt

checkCode = common.IDENTIFICATION_CODE


def home(request):
    return render(request, 'order/order_home.html')


def requestCode(request):
    return JsonResponse({'code': checkCode})


def order_success(request):
    if request.method == 'POST':
        user = request.session.get('name')
        randomid = ''.join(map(str, [random.choice(
            string.ascii_letters) for i in range(5)]))
        now = str(int(datetime.now().timestamp() * 1000))
        user = user if user else randomid+'_' + now
        orderInfo = json.loads(request.POST['returnVal'])
        cartList = json.loads(request.POST['cart'])[0]
        insertList = []
        insert_order = {'id_uid': orderInfo["imp_uid"],
                        'product_uid': orderInfo["merchant_uid"],
                        'member_id': user,
                        'pay': orderInfo["pay_method"],
                        'requestid': orderInfo["request_id"]}
        order.objects.create(**insert_order)
        for num, cart in cartList.items():
            insert_order_product = {'id_uid': orderInfo["imp_uid"],
                                    'product_uid': orderInfo["merchant_uid"],
                                    'member_id': user[:],
                                    'recipe_id': num,
                                    'count': cart["cnt"],
                                    'price': cart['price'],
                                    'ordertime': datetime.now(),
                                    'updatetime': datetime.now()}
            insertList.append(order_info(**insert_order_product))
        order_info.objects.bulk_create(insertList)
    return JsonResponse({'ordernum': now})
