from django.shortcuts import render
from django.http import HttpResponse, JsonResponse


def home(request):
    df = pd.read_excel(
        'C:\\Users\\kyb66\\Desktop\\b.xlsx', header=None)
    # print(df.values.tolist())
    print(df.values.tolist()[0])
    print(""" insert into "calMain_food"(foodname, foodgroup, fooddetail,
            foodsize, foodunit, foodkcal, foodmoisture, fooddan, foodgi, foodtan, fooddang,
            foodfiber, foodcalcium, foodiron, foodmagnesium, foodna, foodcholesterol, foodtrensregion,
            foodcaffeine) values %s """ % df.values.tolist()[0:3])
    # conn = psycopg2.connect(
    #     database='calorie', user='postgres', password='password')
    # cur = conn.cursor()
    # cur.executemany(
    #     """ insert into "calMain_food"(foodname, foodgroup, fooddetail,
    #         foodsize, foodunit, foodkcal, foodmoisture, fooddan, foodgi, foodtan, fooddang,
    #         foodfiber, foodcalcium, foodiron, foodmagnesium, foodna, foodcholesterol, foodtrensregion,
    #         foodcaffeine) values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) """, df.values.tolist())
    # conn.commit()
    # Food.objects.bulk_create([Food(i) for i in df.values.tolist()])
    # Food.objects.bulk_create(df.values.tolist())
    return HttpResponse(None)


def index(request):
    user = request.session.get('name')
    if user:
        print(user)
    else:
        print('None')
    return render(request, 'index.html')


def account(request):
    # form = signin()
    # return render(request, 'login.html', {'form': form})
    return render(request, 'account/account_signup.html')


def login(request):
    return render(request, 'account/account_login.html')
