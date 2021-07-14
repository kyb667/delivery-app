from django.http import JsonResponse
import json, bcrypt
import pandas as pd
from psycopg2.extras import RealDictCursor
from collections import defaultdict
import copy
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
from sellerApp import common, consumers

logger = common.getLogger()

@csrf_exempt
def login(request):
    """
    login
    """
    try:
        logger.info("login start")
        msg = False
        obj = None
        data = json.loads(request.body)
        con = common.getConnection()
        with con.cursor() as cursor:
            cursor.execute("""select pw from seller where id='{0}'""".format(data['id']))
            obj = cursor.fetchall()
        if obj :
            pw = obj[0][0]
            msg = True if bcrypt.checkpw(data['pw'].encode(), pw.encode()) else False
    except Exception as e:
        logger.error(e)
    finally:
        logger.debug("return " + str({'flag':msg}))
        logger.info("login end")
        return JsonResponse({'flag':msg})

@csrf_exempt
def signin(request):
    """
    signin
    """
    try:
        logger.info("signin start")
        msg = False
        data = json.loads(request.body)
        con = common.getConnection()
        data['pw'] = bcrypt.hashpw(data['pw'].encode('utf-8'), bcrypt.gensalt()).decode()
        with con.cursor() as cursor:
            cursor.execute("""
            insert into seller values ({0})""".format(str(list(data.values()))[1:-1]))
            con.commit()
        msg = True
    except Exception as e:
        logger.error(e)
    finally:
        logger.debug("return " + str({'flag':msg}))
        logger.info("signin end")
        return JsonResponse({'flag':msg})

@csrf_exempt
def getRecipe(request):
    """
    getRecipe
    """
    try:
        logger.info("getRecipe start")
        recipeInfo, info = [], None
        data = json.loads(request.body)
        con = common.getConnection()
        with con.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
            select recipeid, recipename, price, recipelove, recipehate, food_name, delivary_flag, takeout_flag
            from recipe
            where seller_id = '{0}'""".format(data['id']))
            info = cursor.fetchall()
        if info:
            df = pd.DataFrame(info)
            df.loc[df.delivary_flag==True,'delivary_flag']='가능'
            df.loc[df.delivary_flag==False,'delivary_flag']='불가능'
            df.loc[df.takeout_flag==False,'takeout_flag']='불가능'
            df.loc[df.takeout_flag==True,'takeout_flag']='가능'
            recipeInfo = df.to_dict('records')
    except Exception as e:
        logger.error(e)
    finally:
        logger.debug("return " + str({'recipeInfo':recipeInfo}))
        logger.info("getRecipe end")
        return JsonResponse({'recipeInfo':recipeInfo})

@csrf_exempt
def getFood(request):
    """
    getFood
    """
    try:
        logger.info("getFood start")
        foodList = []
        con = common.getConnection()
        with con.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""select foodname from food """)
            f = cursor.fetchall()
            foodList = [dict(i) for i in f]
    except Exception as e:
        logger.error(e)
    finally:
        logger.debug("return " + str({'foodList':foodList}))
        logger.info("getFood end")
        return JsonResponse({'foodList':foodList})

@csrf_exempt
def insertRecipe(request):
    """
    insertRecipe
    """
    try:
        logger.info("insertRecipe start")
        msg = False
        data = json.loads(request.body)
        print(data)
        con = common.getConnection()
        with con.cursor() as cursor:
            cursor.execute("""
            insert into recipe(recipename, price, recipelove, recipehate, food_name, delivary_flag, takeout_flag, seller_id, modify)
            values ({0})
            """.format(str(list(data['recipeInfo'].values()))[1:-1]))
            con.commit()
        msg = True
    except Exception as e:
        logger.error(e)
    finally:
        logger.debug("return " + str({'flag':msg}))
        logger.info("insertRecipe end")
        return JsonResponse({'flag':msg})

@csrf_exempt
def updateRecipe(request):
    """
    updateRecipe
    """
    try:
        logger.info("updateRecipe start")
        msg = False
        data = json.loads(request.body)
        recipe_id = data['recipeInfo']['recipeid']
        price = data['recipeInfo']['price'] + '원'
        delivary_flag = data['recipeInfo']['delivary_flag']
        takeout_flag = data['recipeInfo']['takeout_flag']
        con = common.getConnection()
        with con.cursor() as cursor:
            cursor.execute("""
            update recipe
            set price = '{1}',  delivary_flag = {2}, takeout_flag = {3}, modify = modify + 1
            where recipeid = {0}
            """.format(recipe_id, price, delivary_flag, takeout_flag))
            con.commit()
        msg = True
    except Exception as e:
        logger.error(e)
    finally:
        logger.debug("return " + str({'flag':msg}))
        logger.info("updateRecipe end")
        return JsonResponse({'flag':msg})

@csrf_exempt
def getRecipeDetail(request):   
    """
    getRecipeDetail
    """
    try:
        logger.info("getRecipeDetail start")
        recipeInfo = []
        data = json.loads(request.body)
        print(data)
        con = common.getConnection()
        # TODO image
        with con.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
            select recipedetailnum, recipedetailtext, recipedetailtip
            from recipedetail
            where recipe_id = '{0}'
            order by recipedetailnum
            """.format(data['id']))
            f = cursor.fetchall()
            # for i in f:
            #     print(type(i['recipedetailimage']))
            #     print(i['recipedetailimage'])
            if f:
                recipeInfo = [dict(i) for i in f]
    except Exception as e:
        logger.error(e)
    finally:
        logger.debug("return " + str({'recipeInfo':recipeInfo}))
        logger.info("getRecipeDetail end")
        return JsonResponse({'recipeInfo':recipeInfo})

@csrf_exempt
def insertRecipeDetail(request):
    """
    insertRecipeDetail
    """
    try:
        logger.info("getRecipeDetail start")
        data = json.loads(request.body)
        msg = False
        logger.info("input " + str(data))
        con = common.getConnection()
        with con.cursor() as cursor:
            cursor.execute("""
            insert into recipedetail(recipedetailnum,recipedetailtext,recipedetailtip,recipedetailimage,recipe_id)
            values ({0})
            """.format(str(list(data['recipedetail'].values()))[1:-1]))
            con.commit()
            msg = True
    except Exception as e:
        logger.error(e)
    finally:
        logger.debug("return " + str({'flag':msg}))
        logger.info("getRecipeDetail end")
        return JsonResponse({'flag':msg})

@csrf_exempt
def getOrderInfo(request):
    logger.info("getOrderInfo start")
    try:
        orderInfo = []
        data = json.loads(request.body)
        info = {}
        con = common.getConnection()
        with con.cursor() as cursor:
            cursor.execute("""
            with re as (select COALESCE(od.updatetime,od.ordertime) ordertime, sum(case when available_flag is true then 0 else 1 end ) available_flag
            from order_detail od, order_info oi, recipe r
            where od.recipe_id in (
            select recipeid from recipe where seller_id = '{0}')
            and od.id_uid = oi.id_uid
            and COALESCE(od.updatetime,od.ordertime) between '{1}' and '{2}'
            and r.recipeid = od.recipe_id
            group by COALESCE(od.updatetime,od.ordertime), oi.id_uid)

            select ordertime, sum(case when available_flag = 0 then 1 else 0 end ) finish, sum(case when available_flag = 1 then 1 else 0 end ) state
            from re
            group by ordertime
            """.format(data['id'],data['start'],data['last']))
            orderInfo = cursor.fetchall()
            logger.info("orderInfo : " + str(orderInfo))
            for i in orderInfo:
                ordertime, finish, state = i
                info[ordertime.strftime('%Y-%m-%d')] = [finish, state]
            orderInfo = info
    except Exception as e:
        logger.error(e)
    finally:
        logger.debug("return " + str({'orderInfo':orderInfo}))
        logger.info("getOrderInfo end")
        return JsonResponse({'orderInfo':orderInfo})

@csrf_exempt
def deleteRecipe(request):
    """
    deleteRecipe
    """
    try:
        logger.info("deleteRecipe start")
        msg = False
        data = json.loads(request.body)
        con = common.getConnection()
        with con.cursor() as cursor:
            cursor.execute("""
            delete from recipe where recipeid = {0};
            delete from recipedetail where recipe_id = {0};
            """.format(data['recipeid']))
            con.commit()
        msg = True
    except Exception as e:
        logger.error(e)
    finally:
        logger.debug("return " + str({'flag':msg}))
        logger.info("deleteRecipe end")
        return JsonResponse({'flag':msg})

@csrf_exempt
def getOrderInfoDetail(request):
    logger.info("getOrderInfoDetail start")
    try:
        getOrderInfoDetail, info = [], {}
        data = json.loads(request.body)
        con = common.getConnection()
        flag = ''
        if data['flag'] == 'finish':
            flag = True
        elif data['flag'] == 'state':
            flag = False
        with con.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
            select oi.*, r.recipename, od.count, od.price, COALESCE(od.updatetime,od.ordertime) ordertime
            from order_detail od, order_info oi, recipe r
            where od.recipe_id in (
            select recipeid from recipe where seller_id = '{0}')
            and od.id_uid = oi.id_uid
            and COALESCE(od.updatetime,od.ordertime) = '{1}'
            and r.recipeid = od.recipe_id
            and oi.available_flag is {2}
            """.format(data['id'], data['start'], flag))
            getOrderInfoDetail = [dict(i) for i in cursor.fetchall()]
            for i in getOrderInfoDetail:
                if i['id_uid'] in info:
                    info[i['id_uid']].append(i)
                else:
                    info[i['id_uid']] = [i]
            getOrderInfoDetail = info
    except Exception as e:
        logger.error(e)
    finally:
        logger.debug("return " + str({'getOrderInfoDetail':getOrderInfoDetail}))
        logger.info("getOrderInfoDetail end")
        return JsonResponse({'getOrderInfoDetail':getOrderInfoDetail})

@csrf_exempt
def send(request):
    logger.info("send start")
    try:
        code = {'code': 500}
        data = json.loads(request.body)
        code = consumers.send_message(data)
    except Exception as e:
        code = {'code': 500}
        logger.error(e)
    finally:
        logger.info("send end")
        return JsonResponse({'send':code})