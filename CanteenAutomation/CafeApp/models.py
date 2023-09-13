from django.db import models
from django.contrib.auth.models import User

# Create your models here.
# from django.contrib.auth.models import AbstractUser

# class User(AbstractUser):
#     type  = models.CharField(max_length=100,choices=(('Canteen','Canteen'),('Customer','Customer')))

#     class Meta:
#         db_table = 'auth_user'

class canteen(models.Model):
    owner = models.OneToOneField(User,null=True,on_delete=models.CASCADE)
    canteen_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    contact_number = models.CharField(max_length=12, null=True)



class customer(models.Model):
    cust = models.OneToOneField(User,null=True,on_delete=models.CASCADE)
    customer_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    contact_number = models.CharField(max_length=12, null=True)


class items(models.Model):
    canteen = models.ForeignKey(canteen,on_delete=models.CASCADE,blank=True,null=True)
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=25)
    desc = models.TextField()
    price = models.IntegerField(null=False)

class orders(models.Model):
    order_cust = models.ForeignKey(customer,null=True,on_delete=models.CASCADE)
    id = models.AutoField(primary_key=True)
    items = models.ManyToManyField(items,related_name="order_item",default=None,blank=False)
    total_amount = models.IntegerField()
