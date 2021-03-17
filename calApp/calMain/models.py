from django.db import models


class food(models.Model):
    foodname = models.CharField(max_length=100)
    foodgroup = models.CharField(max_length=200)
    fooddetail = models.CharField(max_length=200)
    foodsize = models.IntegerField()
    foodunit = models.CharField(max_length=10)
    foodkcal = models.FloatField()
    foodmoisture = models.FloatField()
    fooddan = models.FloatField()
    foodgi = models.FloatField()
    foodtan = models.FloatField()
    fooddang = models.FloatField()
    foodfiber = models.FloatField()
    foodcalcium = models.FloatField()
    foodiron = models.FloatField()
    foodmagnesium = models.FloatField()
    foodna = models.FloatField()
    foodcholesterol = models.FloatField()
    foodtrensregion = models.FloatField()
    foodcaffeine = models.FloatField()

    class Meta:
        db_table = 'food'


class member(models.Model):
    memberid = models.CharField(max_length=20, primary_key=True)
    memberpw = models.CharField(max_length=100)
    membername = models.CharField(max_length=20)
    membergender = models.CharField(max_length=6)
    memberemail = models.CharField(max_length=100)
    memberbirth = models.DateField()
    memberheight = models.IntegerField()
    memberweight = models.IntegerField()

    class Meta:
        db_table = 'member'


class food_detail(models.Model):
    fooddetail = models.ForeignKey(food, on_delete=models.CASCADE)
    foodimage = models.ImageField()
    foodlove = models.BigIntegerField()
    foodhate = models.BigIntegerField(default=0)

    class Meta:
        db_table = 'food_detail'


class comment(models.Model):
    subject = models.ForeignKey(food, on_delete=models.CASCADE)
    writer = models.ForeignKey(member, on_delete=models.CASCADE)
    writingtime = models.DateTimeField()
    comment = models.TextField()
    modify = models.BigIntegerField(default=0)
    commentlove = models.BigIntegerField(default=0)
    commenthate = models.BigIntegerField(default=0)

    class Meta:
        db_table = 'comment'


class recipe(models.Model):
    recipeid = models.AutoField(primary_key=True)
    recipename = models.CharField(max_length=1000)
    recipesummary = models.CharField(max_length=1000)
    recipelevel = models.CharField(max_length=100)
    writer = models.ForeignKey(member, on_delete=models.CASCADE)
    recipegroup = models.CharField(max_length=20)
    recipetype = models.CharField(max_length=20)
    recipeservings = models.CharField(max_length=20)
    recipecal = models.CharField(max_length=20)
    recipecookingtime = models.CharField(max_length=20)
    recipeirdntcode = models.CharField(max_length=20)
    recipeimage = models.ImageField()
    price = models.CharField(max_length=20)
    modify = models.BigIntegerField(default=0)
    recipelove = models.BigIntegerField(default=0)
    recipehate = models.BigIntegerField(default=0)

    class Meta:
        db_table = 'recipe'


class recipedetail(models.Model):
    recipedetailid = models.ForeignKey(recipe, on_delete=models.CASCADE)
    recipedetailnum = models.BigIntegerField(default=1)
    recipedetailtext = models.TextField()
    recipedetailtip = models.TextField()
    recipedetailimage = models.ImageField()

    class Meta:
        db_table = 'recipedetail'
