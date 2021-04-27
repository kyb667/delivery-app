from django.db import models
from datetime import datetime


class member(models.Model):  # 일반 유저 테이블
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


class seller(models.Model):  # 판매자 테이블
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


class rider(models.Model):  # 배달원 테이블
    id = models.CharField(max_length=20, primary_key=True)  # 배달원 아이디
    pw = models.CharField(max_length=100)  # 패스워드
    name = models.CharField(max_length=20)  # 이름
    email = models.CharField(max_length=100)  # 이메일
    postcode = models.IntegerField()  # 우편번호
    roadAddress = models.CharField(max_length=100)  # 주소
    jibunAddress = models.CharField(max_length=100)  # 주소
    detailAddress = models.CharField(max_length=100)  # 주소

    class Meta:
        db_table = 'rider'


class food(models.Model):  # 음식 항목 테이블
    foodname = models.CharField(max_length=100, primary_key=True)  # 음식 이름
    foodgroup = models.CharField(max_length=200)  # 음식 그룹
    fooddetail = models.CharField(max_length=200)  # 음식 상태

    class Meta:
        db_table = 'food'


class recipe(models.Model):  # 등록된 음식 테이블
    seller_id = models.ForeignKey(seller, on_delete=models.CASCADE)  # 판매자
    food_name = models.ForeignKey(food, on_delete=models.CASCADE)  # 음식 항목
    recipeid = models.AutoField(primary_key=True)  # 레시피 기본번호
    recipename = models.CharField(max_length=1000)  # 레시피 이름
    recipesummary = models.CharField(max_length=1000)  # 레시피 소개
    price = models.CharField(max_length=20)  # 레시피 가격
    modify = models.BigIntegerField(default=0)  # 레시피 수정횟수
    recipelove = models.BigIntegerField(default=0)  # 레시피 좋아요 수
    recipehate = models.BigIntegerField(default=0)  # 레시피 싫어요 수
    delivary_flag = models.BooleanField(default=False)  # 배달가능
    takeout_flag = models.BooleanField(default=False)  # 테이크아웃 가능

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


class recipedetail(models.Model):  # 음식 세부 테이블
    recipe_id = models.ForeignKey(recipe, on_delete=models.CASCADE)  # 음식 아이디
    recipedetailnum = models.BigIntegerField()  # 음식 레시피 번호
    recipedetailtext = models.TextField()  # 음식 레시피
    recipedetailtip = models.TextField()  # 음식 레시피 팁
    recipedetailimage = models.ImageField()  # 음식 이미지

    class Meta:
        db_table = 'recipedetail'


class order_info(models.Model):  # 음식 주문 테이블
    id_uid = models.CharField(primary_key=True, max_length=200)  # 기본키
    product_uid = models.CharField(max_length=200)  # 상품 번호
    member_id = models.CharField(max_length=200)  # 주문자 아이디
    pay = models.CharField(max_length=20)  # 주문방법
    order_money = models.IntegerField()  # 총 금액
    order_password = models.CharField(max_length=200)  # 주문자 패스워드
    order_email = models.CharField(max_length=100)  # 주문자 이메일
    order_phone = models.CharField(max_length=100)  # 주문자 전화번호
    order_postcode = models.IntegerField()  # 주문자 우편번호
    order_roadAddress = models.CharField(max_length=100)  # 주문자 주소
    order_detailAddress = models.CharField(max_length=100)  # 주문자 주소
    available_flag = models.BooleanField(default=True)  # 주문 취소여부

    class Meta:
        db_table = 'order_info'


class order_detail(models.Model):  # 음식 주문 세부 테이블
    num = models.BigAutoField(primary_key=True)
    id_uid = models.ForeignKey(order_info, on_delete=models.CASCADE)  # 기본키
    product_uid = models.CharField(max_length=200)  # 상품번호
    member_id = models.CharField(max_length=200)  # 주문자 아이디
    recipe_id = models.ForeignKey(
        recipe, on_delete=models.CASCADE)  # 주문한 음식 번호
    count = models.BigIntegerField()  # 주문한 음식 개수
    price = models.CharField(max_length=20)  # 주문한 가격
    ordertime = models.DateField(auto_now_add=datetime.now())  # 시킨 시간
    updatetime = models.DateField(auto_now=datetime.now())  # 변경 시간

    class Meta:
        db_table = 'order_detail'


class delivary(models.Model):  # 음식 배달 테이블
    id_uid = models.ForeignKey(order_info, on_delete=models.CASCADE)  # 주문 기본키
    status = models.CharField(max_length=50, default='주문 접수중')  # 배달 상태
    rider_id = models.ForeignKey(
        rider, on_delete=models.CASCADE, default='미정')  # 배달자

    class Meta:
        db_table = 'delivary'
