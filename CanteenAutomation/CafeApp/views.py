from django.shortcuts import render,redirect
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth  import authenticate, login, logout
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.forms import inlineformset_factory
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from rest_framework_simplejwt.views import TokenObtainPairView

# from .forms import CreateUserForm
from django.contrib import messages
from .models import *
from django.db.models import Q
# from .forms import *
import json
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from django.contrib.auth import login, authenticate
from .models import User
from .serializers import *
from .models import CustomBlacklistedToken
import time
from datetime import timezone,timedelta
class CustomLogoutView(APIView):
    # permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            # logout(request)
            # If the request doesn't contain a refresh token in the data, handle the exception
        except KeyError:
            return Response({'detail': 'Refresh token is required in the request data.'}, status=status.HTTP_400_BAD_REQUEST)
        
        refresh_token_obj = RefreshToken(refresh_token)
        refresh_token_obj.blacklist()
        # access_token_obj.blacklist()
        
        return Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)

# Create your views here.
class UserLogin(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        # HttpResponse(username,password)
        user = authenticate(username=username, password=password)

        if user is None:
            return Response({
                'message':  'invalid username or password',
            }, status=status.HTTP_403_FORBIDDEN)

        login(request=request, user=user)
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)


class UserRegistration(APIView):
    def post(self, request):
        # first_name, username, email, password
        serialize_user_data = UserSerializer(data=request.data)
        if not serialize_user_data.is_valid():
            return Response({
                'errors': serialize_user_data.errors,
                'message': 'invalid user data'
            }, status=status.HTTP_406_NOT_ACCEPTABLE)

        serialize_user_data.save()

        user = User.objects.get(username=request.data.get('username'))
        if request.data.get("type")=="Canteen":
            Profile.objects.create(user = user,type='Canteen',name=request.data.get("name"),contact_number = request.data.get("contact_number"))
            canteen.objects.create(owner = user.profile)
        else:
            Profile.objects.create(user = user,type='Customer',name=request.data.get("name"),contact_number = request.data.get("contact_number"))
            customer.objects.create(cust = user.profile)

        refresh = RefreshToken.for_user(user)
        # refresh = RefreshToken.for_user(serialize_user_data)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'account created'
        }, status=status.HTTP_201_CREATED)

class RefreshAccessToken(APIView):
    def post(self,request):
        refresh_token = request.data.get("refresh")
        try:
            # Create a RefreshToken instance from the provided refresh token
            refresh_token = RefreshToken(refresh_token)
            
            # Get a new access token from the refresh token
            access_token = str(refresh_token.access_token)

            return Response({
                'access': str(access_token),
                'message': 'token created'
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            # Handle any exceptions that might occur during token refresh
            print(f"Token refresh failed: {e}")
            return Response({
                'message': 'Fail'
            })
def index(request):
    return HttpResponse('Hello world')

class DeleteItems(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication] 
    def post(self,request):
        
        # try:
           canteen_obj = canteen.objects.filter(owner = request.user.profile)[0]
           if canteen_obj is not None:
               item_id=request.data.get('item_id')
               delete_object=items.objects.filter(id=item_id).first()
               if delete_object.canteen==canteen_obj:
                delete_object.delete()
                item_obj = items.objects.filter(canteen=canteen_obj)
                Item_serialized = MenuItemSerializer(item_obj,many=True)
                return Response(Item_serialized.data,status=status.HTTP_200_OK)    
           return Response({"success":False},status=status.HTTP_200_OK)

class GetItems(APIView):
    
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def post(self,request):
        
        # try:
           canteen_obj = canteen.objects.filter(owner = request.user.profile)[0]
           if canteen_obj is not None:
               name = request.data.get("name")
               desc = request.data.get("desc")
               price = request.data.get("price")
               items.objects.create(canteen=canteen_obj,price=price,name=name,desc=desc)
               return Response({"success":True},status=status.HTTP_200_OK)
        # except:
        #     pass
        #     return Response({"pass":False},status=status.HTTP_200_OK)
       

    def get(self,request):
        canteen_obj = canteen.objects.filter(owner = request.user.profile)[0]
        item_obj = items.objects.filter(canteen=canteen_obj)
        Item_serialized = MenuItemSerializer(item_obj,many=True)
        return Response(Item_serialized.data,status=status.HTTP_200_OK)



class getOrders(APIView):
    
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self,request):
        
        try:
           customer_obj = customer.objects.filter(owner = request.user.profile)[0]
           if customer_obj is not None:
               it=request.data.get("items")
               status = request.data.get("status")
               total_amount = request.data.get("total_amount")
               orders.objects.create(customer=customer_obj,total_amount=total_amount,status=status,items=it)
        except:
            pass
        return Response({"success":True},status=status.HTTP_200_OK)
    
    def get(self,request):
        
        canteen_obj = canteen.objects.filter(owner = request.user.profile)[0]
        order_obj = orders.objects.filter(order_canteen=canteen_obj,status="Delivered")
        Item_serialized = OrderSerializer(order_obj,many=True)
        for i in Item_serialized.data:
            order_id=i["id"]
            for j in i:
                if(j=='items'):
                    for k in i[j]:
                        item_id=k["id"]
                        quantity_value=orderquantity.objects.filter(item_id=item_id,order_id=order_id).first()
                        if(quantity_value is not None):
                            k["quantity"]=quantity_value.quantity
                        else:
                            print(order_id)
        return Response(Item_serialized.data,status=status.HTTP_200_OK)

class getaccountdetails(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self,request):        
        customer_obj_profile = Profile.objects.filter(user = request.user)[0]
        customer_obj=customer.objects.filter(cust=customer_obj_profile).first()
        Cust_serialized=AccountDetailsSerializer(customer_obj_profile)
        final_obj={}
        for i in Cust_serialized.data:
            print(Cust_serialized[i])
            final_obj[i]=Cust_serialized[i].value
        k=orders.objects.filter(order_cust=customer_obj).count()
        final_obj["total_orders"]=k
        return Response(final_obj,status=status.HTTP_200_OK)

class getPendingOrders(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        # try:
            canteen_obj = canteen.objects.filter(owner=request.user.profile)[0]

            if canteen_obj is not None:
                order_obj = orders.objects.filter(order_canteen=canteen_obj, status__in=['Received'])
                Item_serialized = OrderSerializer(order_obj,many=True)
                for i in Item_serialized.data:
                    order_id=i["id"]
                    for j in i:
                        if(j=='items'):
                            for k in i[j]:
                                item_id=k["id"]
                                quantity_value=orderquantity.objects.filter(item_id=item_id,order_id=order_id).first()
                                k["quantity"]=quantity_value.quantity
                return Response(Item_serialized.data,status=status.HTTP_200_OK)
        # except:
        #     pass
        # return Response({"success":False})
    
class getallcanteens(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        canteen_obj=canteen.objects.all()
        Canteen_serialized = CanteenSerializer(canteen_obj,many=True)
        return Response(Canteen_serialized.data,status=status.HTTP_200_OK)
    
class getcustOrders(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self,request):
        try:
            customer_obj = customer.objects.filter(cust = request.user.profile)[0]
            order_obj = orders.objects.filter(order_cust=customer_obj)
            Item_serialized = OrderSerializer(order_obj,many=True)
            for i in Item_serialized.data:
                total_quantity=0
                order_id=i["id"]
                for j in i:
                    if(j=='items'):
                        for k in i[j]:
                            item_id=k["id"]
                            quantity_value=orderquantity.objects.filter(item_id=item_id,order_id=order_id).first()
                            k["quantity"]=quantity_value.quantity
                            total_quantity=total_quantity+quantity_value.quantity
                i["total_quantity"]=total_quantity
            return Response(Item_serialized.data,status=status.HTTP_200_OK)
        except:
            return Response({"success":False})
        
class createorder(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def post(self,request):
        customer_profile_obj = Profile.objects.filter(user = request.user)[0]
        customer_obj=customer.objects.filter(cust=customer_profile_obj).first()
        canteen_id=request.data.get('canteen_id')
        canteen_obj=canteen.objects.filter(canteen_id=canteen_id).first()
        data =request.data.get("order")
        orderid=request.data.get("order_id")
        if(orderid == -1):
            order_obj = orders.objects.create(order_cust=customer_obj,order_canteen=canteen_obj,status="AddedToCart",total_amount=request.data.get("total_amount"))
        else:
            order_obj=orders.objects.filter(id=orderid)
            order_obj.delete()
            order_obj = orders.objects.create(order_cust=customer_obj,order_canteen=canteen_obj,status="AddedToCart",total_amount=request.data.get("total_amount"))
        for itr in data:
            item_obj=items.objects.filter(id=itr["item_id"]).first()
            quan_obj=itr["quantity"]
            orderquantity.objects.create(order_id=order_obj,item_id=item_obj,quantity=quan_obj)
            order_obj.items.add(item_obj)
        order_obj.save()
        return Response({"order_id":order_obj.id},status=status.HTTP_200_OK)
    
class ConfirmOrder(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def post(self,request):
        orderid=request.data.get("order_id")
        order_obj=orders.objects.filter(id=orderid).first()
        order_obj.status="Received"
        order_obj.save()
        return Response({"order_id":orderid},status=status.HTTP_200_OK)
    
class GetMenu(APIView):

    def get(self,request,canteen_id):
            item_obj=items.objects.filter(canteen=canteen_id)
            Item_serialized = MenuItemSerializer(item_obj,many=True)
            return Response(Item_serialized.data,status=status.HTTP_200_OK)



class GetFeedback(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def post(self, request):
        order_id=request.data.get('order_id')
        fd=request.data.get('feedback')
        #rating=request.data.get('rating')
        order_obj=orders.objects.filter(id=order_id).first()
        if(request.user == order_obj.order_cust.cust.user):
            feedback_obj=feedback.objects.create(order_id=order_obj,review=fd)
            customer_profile_obj = Profile.objects.filter(user = request.user)[0]
            customer_obj=customer.objects.filter(cust=customer_profile_obj).first()
            order_obj=orders.objects.filter(order_cust=customer_obj,status='Delivered')
            order_serialized=OrderSerializer(order_obj,many=True)
            for i in order_serialized.data:
                order_id=i["id"]
                for j in i:
                    if(j=='items'):
                        for k in i[j]:
                            item_id=k["id"]
                            quantity_value=orderquantity.objects.filter(item_id=item_id,order_id=order_id).first()
                            if(quantity_value is not None):
                                k["quantity"]=quantity_value.quantity
                            else:
                                print(order_id)
            fed_orders=[]
            for i in list(feedback.objects.all().values()):
                fed_orders.append(i["order_id_id"])
            final_list=[]
            for i in order_serialized.data:
                if i["id"] not in fed_orders:
                    final_list.append(i)
            print(fed_orders)
            return Response(final_list,status=status.HTTP_200_OK)
        return Response({"success":False})
    def get(self,request):
        customer_profile_obj = Profile.objects.filter(user = request.user)[0]
        customer_obj=customer.objects.filter(cust=customer_profile_obj).first()
        order_obj=orders.objects.filter(order_cust=customer_obj,status='Delivered')
        order_serialized=OrderSerializer(order_obj,many=True)
        for i in order_serialized.data:
            order_id=i["id"]
            for j in i:
                if(j=='items'):
                    for k in i[j]:
                        item_id=k["id"]
                        quantity_value=orderquantity.objects.filter(item_id=item_id,order_id=order_id).first()
                        if(quantity_value is not None):
                            k["quantity"]=quantity_value.quantity
                        else:
                            print(order_id)
        fed_orders=[]
        for i in list(feedback.objects.all().values()):
            fed_orders.append(i["order_id_id"])
        final_list=[]
        for i in order_serialized.data:
            if i["id"] not in fed_orders:
                final_list.append(i)
        print(fed_orders)
        return Response(final_list,status=status.HTTP_200_OK)

from django.core.mail import send_mail
class OrderDelivered(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def post(self, request):
        order_id=request.data.get('order_id')
        canteen_obj = canteen.objects.filter(owner=request.user.profile)[0]
        order_obj=orders.objects.filter(id=order_id).first()
        if(order_obj.order_canteen==canteen_obj):
            order_obj.status="Delivered"
            order_obj.save()
            name = order_obj.order_cust.cust.name
            send_mail(
                "Your Order Is Prepared",
                f"Hii {name}. Your order is prepared",
                "django.reset.system@gmail.com",
                [f"{order_obj.order_cust.cust.user.email}"],
                fail_silently=False,
            )
        if canteen_obj is not None:
            order_obj = orders.objects.filter(order_canteen=canteen_obj, status__in=['Received'])
            Item_serialized = OrderSerializer(order_obj,many=True)
            for i in Item_serialized.data:
                order_id=i["id"]
                for j in i:
                    if(j=='items'):
                        for k in i[j]:
                            item_id=k["id"]
                            quantity_value=orderquantity.objects.filter(item_id=item_id,order_id=order_id).first()
                            k["quantity"]=quantity_value.quantity
            return Response(Item_serialized.data,status=status.HTTP_200_OK)
