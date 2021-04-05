from django.db import models
from datetime import datetime


class member(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    pw = models.CharField(max_length=100)
    name = models.CharField(max_length=20)
    email = models.CharField(max_length=100)
    postcode = models.IntegerField()
    roadAddress = models.CharField(max_length=100)
    jibunAddress = models.CharField(max_length=100)
    detailAddress = models.CharField(max_length=100)

    class Meta:
        db_table = 'member'


class seller(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    pw = models.CharField(max_length=100)
    name = models.CharField(max_length=20)
    email = models.CharField(max_length=100)
    postcode = models.IntegerField()
    roadAddress = models.CharField(max_length=100)
    jibunAddress = models.CharField(max_length=100)
    detailAddress = models.CharField(max_length=100)

    class Meta:
        db_table = 'seller'


class rider(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    pw = models.CharField(max_length=100)
    name = models.CharField(max_length=20)
    email = models.CharField(max_length=100)
    postcode = models.IntegerField()
    roadAddress = models.CharField(max_length=100)
    jibunAddress = models.CharField(max_length=100)
    detailAddress = models.CharField(max_length=100)

    class Meta:
        db_table = 'rider'


class food(models.Model):
    foodname = models.CharField(max_length=100, primary_key=True)
    foodgroup = models.CharField(max_length=200)
    fooddetail = models.CharField(max_length=200)

    class Meta:
        db_table = 'food'


class recipe(models.Model):
    seller_id = models.ForeignKey(seller, on_delete=models.CASCADE)
    food_name = models.ForeignKey(food, on_delete=models.CASCADE)
    recipeid = models.AutoField(primary_key=True)
    recipename = models.CharField(max_length=1000)
    recipesummary = models.CharField(max_length=1000)
    price = models.CharField(max_length=20)
    modify = models.BigIntegerField(default=0)
    recipelove = models.BigIntegerField(default=0)
    recipehate = models.BigIntegerField(default=0)

    class Meta:
        db_table = 'recipe'


# class comment(models.Model):
#     # subject = models.ForeignKey(food, on_delete=models.CASCADE)
#     # writer = models.ForeignKey(member, on_delete=models.CASCADE)
#     writingtime = models.DateTimeField()
#     comment = models.TextField()
#     modify = models.BigIntegerField(default=0)
#     commentlove = models.BigIntegerField(default=0)
#     commenthate = models.BigIntegerField(default=0)

#     class Meta:
#         db_table = 'comment'


class recipedetail(models.Model):
    recipe_id = models.ForeignKey(recipe, on_delete=models.CASCADE)
    recipedetailnum = models.BigIntegerField()
    recipedetailtext = models.TextField()
    recipedetailtip = models.TextField()
    recipedetailimage = models.ImageField()

    class Meta:
        db_table = 'recipedetail'


class order_info(models.Model):
    id_uid = models.CharField(primary_key=True, max_length=200)
    product_uid = models.CharField(max_length=200)
    member_id = models.CharField(max_length=200)
    pay = models.CharField(max_length=20)
    order_money = models.IntegerField()
    order_password = models.CharField(max_length=200)
    order_email = models.CharField(max_length=100)
    order_phone = models.CharField(max_length=100)
    order_postcode = models.IntegerField()
    order_roadAddress = models.CharField(max_length=100)
    order_detailAddress = models.CharField(max_length=100)
    available_flag = models.BooleanField(default=True)

    class Meta:
        db_table = 'order_info'


class order_detail(models.Model):
    num = models.BigAutoField(primary_key=True)
    id_uid = models.ForeignKey(order_info, on_delete=models.CASCADE)
    product_uid = models.CharField(max_length=200)
    member_id = models.CharField(max_length=200)
    recipe_id = models.ForeignKey(recipe, on_delete=models.CASCADE)
    count = models.BigIntegerField()
    price = models.CharField(max_length=20)
    ordertime = models.DateField(auto_now_add=datetime.now())
    updatetime = models.DateField(auto_now=datetime.now())

    class Meta:
        db_table = 'order_detail'


class delivary(models.Model):
    id_uid = models.ForeignKey(order_info, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, default='주문 접수중')
    rider_id = models.ForeignKey(rider, on_delete=models.CASCADE, default='미정')

    class Meta:
        db_table = 'delivary'
