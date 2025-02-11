from django.http import HttpResponse
from .forms import UserRegister, ResetPasswordEmail, SubmitReset, Checkotp, EmailNotifyForm, SubscribeList, DeleteSubItem, editUserInfo
import json, os, random, threading
from django.views import View
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, Token
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from member.models import Password_OTP, Client_Notify_List
from django.utils import timezone
from datetime import timedelta, datetime
from search.sendEmail import sendEmail
from search.sqlQueries import sqlQueries_Filter_Subscribe
from .serializer import MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenViewBase
from rest_framework.views import APIView
from dotenv import load_dotenv
import time


OTP_TIMEOUT = 8
# load_dotenv(r"/home/server/shoe_watcher/search/.env")
# load_dotenv(r"../.env")
# this function is used to access the rest_framework
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_routes(request):
    routes = [
        "/token",
        "/token/refresh",
    ]
    
    return Response(routes)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def test_data( request):

    return HttpResponse(status=201, content="you're logged in")

@api_view(["POST"])
def logout(request):
    data = json.loads(request.body)
    
    try:
        token = RefreshToken(data.get("refresh"))
        token.blacklist()
    except Exception as e:
        print(e)

    return HttpResponse(status=200, content="ok")

class MyTokenObtainPairView(TokenViewBase):
    serializer_class = MyTokenObtainPairSerializer

class JsonValidate():
    def validate(jsonBody):
        try:
            json.loads(jsonBody)
            return True
        except:
            return False
    

class getSubscribeList(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        
        if not JsonValidate.validate(request.body):
            return HttpResponse(status=400, content="invalid input")
        
        form = SubscribeList(json.loads(request.body))
        
        if form.is_valid():
            user = User.objects.filter(username=form.cleaned_data.get("username"), email=form.cleaned_data.get("email"))
            if len(user) != 1:
                return HttpResponse(status=401, content="invalid input")
            
            sqlObj = sqlQueries_Filter_Subscribe(username_id=user[0].id)
            jsonData = sqlObj.makeQuery()
            return HttpResponse(status=200, content=jsonData)
            
        return HttpResponse(status=400, content="bad request")

class deleteSubscribeItem(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request):
        if not JsonValidate.validate(request.body):
            return HttpResponse(status=400, content="invalid input")
        form = DeleteSubItem(json.loads(request.body))
        
        if form.is_valid():            
            sqlObj = Client_Notify_List.objects.filter(id=form.cleaned_data.get("id"), sfccid=form.cleaned_data.get("sfccid"), username_id=form.cleaned_data.get("username_id"))
            sqlObj.delete()
            return HttpResponse(status=200, content="")
        
        return HttpResponse(status=400, content="bad request")
    
class updateUserInfo(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        if not JsonValidate.validate(request.body):
            return HttpResponse(status=400, content="invalid input")
        form = editUserInfo(json.loads(request.body))
        if form.is_valid():
            time.sleep(1)            
            print(form.cleaned_data)
            user = User.objects.filter(username=form.cleaned_data.get("oldUser"), email=form.cleaned_data.get("oldEmail"))
            print(user)
            if user and len(user)== 1:
                if user[0].username != form.cleaned_data.get("username"):
                    user[0].username = form.cleaned_data.get("username")
                    print("change username")
                if user[0].email != form.cleaned_data.get("email"):
                    user[0].email = form.cleaned_data.get("email")
                    print("change email")
                user[0].set_password(form.cleaned_data.get("password"))
                user[0].save()
                # print(user)
                
            return HttpResponse(status=200, content="ok")
        
        return HttpResponse(status=400, content="bad request")
        

class SetEmailNotify(APIView):
    
    permission_classes = [IsAuthenticated]
    def emailWorker(self, formData):
        print(formData)

        
        user = os.getenv("gmail")
        paramDic = {"sender":user,
                    "toWho": formData["email"],
                    "subject": "price notifier subscription",
                    "password": os.getenv("gm_password")
                    
                    }
        sendEmailObj = sendEmail(user=user, password=os.getenv("gm_password"))
        # {**dic1, **dic2} is a shorthand for combining to dictionary together
        sendEmailObj.send_confirmation_mail({**paramDic,**formData})
    

    def post(self, request):

        form = EmailNotifyForm(json.loads(request.body))
        validate, _ = form.validateInput()
        if validate:
            
            user = User.objects.filter(username=form.cleaned_data.get("username"))
            checkNotifyExist = Client_Notify_List.objects.filter(email=form.cleaned_data.get("email"),
                                                            sfccid=form.cleaned_data.get("sfccid"),)
            if len(user) != 1:
                print("error: more than one using in database")
                return Response(status=500)
            
            if len(checkNotifyExist) == 1:
                
                checkNotifyExist[0].last_price = form.cleaned_data.get("price")
                checkNotifyExist[0].price = form.cleaned_data.get("price")
                checkNotifyExist[0].save()
            else:
                try:
                    notifyObj = Client_Notify_List.objects.create(username_id=user[0].id, 
                                                                shoe_link=form.cleaned_data.get("html_link"),
                                                                email=form.cleaned_data.get("email"),
                                                                sfccid=form.cleaned_data.get("sfccid"), 
                                                                price= form.cleaned_data.get("price"),
                                                                last_price=form.cleaned_data.get("price"))
                    notifyObj.save()
                except Exception as e:
                    print(e)
            
            # threading doesn't work since uwsgi already spawn their own worker thread
            # t1 = threading.Thread(target=self.emailWorker, args=(form.cleaned_data,))
            # t1.start()
            self.emailWorker(form.cleaned_data)
        else:
            return Response(status=400)
        return Response(status=201, data="ok")

class resetPasswordRequest(View):
    
    def post(self, request):

        if not JsonValidate.validate(request.body):
            return HttpResponse(status=400, content="invalid input")
        form = ResetPasswordEmail(json.loads(request.body))
        if form.is_valid():
            
            userObj = self.checkEmailExist(form.cleaned_data)
            if userObj:
                print(userObj.email, userObj.username)
                
                existingOtp = Password_OTP.objects.filter(email=userObj.email)
                otp = self.generateOTP()
                try:
                    if len(existingOtp) == 1:
                        existingOtp[0].otp = otp
                        existingOtp[0].createDate = timezone.now()
                        existingOtp[0].save()
                    else:
                        otpRequest = Password_OTP.objects.create(email=userObj.email, used=False,otp=otp)
                        otpRequest.save()
                    self.emailWorker(userObj.email, otp)
                    # threading doesn't work since uwsgi already spawn their own worker thread
                    # t1 = threading.Thread(target=self.emailWorker, args=(userObj.email, otp))
                    # t1.start()
                except Exception as e:
                    print(e)
                    return HttpResponse(status=500, content="server error")
                
                
            return HttpResponse(status=200, content="email sent")
        return HttpResponse(status=400, content="invalid input")   
    
    def checkEmailExist(self, cleanData):
        try:
            obj = User.objects.get(email=cleanData.get("email"))
            return obj
        except ObjectDoesNotExist:
            return None
    
    def generateOTP(self):
        
        return random.randrange(1,999999999,1)
    
    def emailWorker(self, email, otp):

        user = os.getenv("gmail")
        paramDic = {"fromWho":user,
                    "toWho": email,
                    "subject": "shoe watcher one time password",
                    "body":"attached is your OTP(one time password), please be careful and not share this with anyone\n\n\n{}".format(otp)
                    }
        sendEmailObj = sendEmail(user=user, password=os.getenv("gm_password"))
        # {**dic1, **dic2} is a shorthand for combining to dictionary together
        sendEmailObj.basicMail(**paramDic)

    
# handles incoming OTP and create a one time auth jwt for changing password
# it requires email and otp in json format
# once verified a jwt token will be issues for subsequent change request   
class otpVerify(View):
    def post(self, request):
        
        if not JsonValidate.validate(request.body):
            return HttpResponse(status=400, content="invalid input")

        form = Checkotp(json.loads(request.body))
            
        if form.is_valid():
            try:
                findOtp = self.getOtpResult(**form.cleaned_data)
                if len(findOtp) == 1 and not self.checkExpired(findOtp[0].createDate):
                    return HttpResponse(status=200, content="ok")
            except Exception as e:
                print(e)
                return HttpResponse(status=500, content="server error")
        
        return HttpResponse(status=401, content="invalid or expired otp")
    
    def checkOtpExists(self, cleanData):
        try:
            obj = Password_OTP.objects.get(email=cleanData.get("email"))
            return obj
        except ObjectDoesNotExist:
            return None

    def getOtpResult(self, email, otp):
        return Password_OTP.objects.filter(email=email, otp=otp)
    
    # this function requires the timestamp to be a datetime object
    # the datetime object will be timezone sensitive
    # return true if time difference is greater then set timeout(default = 10 minutes)
    def checkExpired(self,timestamp):
        timediff = timezone.now() - timestamp
        print(timediff, timedelta(minutes=OTP_TIMEOUT))
        return timediff > timedelta(minutes=OTP_TIMEOUT) 
        

class resetPass(otpVerify):
    
    def post(self, request):
        
        if not JsonValidate.validate(request.body):
            return HttpResponse(status=400, content="invalid input")
        form = SubmitReset(json.loads(request.body))
        if form.is_valid():
            userOtp = self.getOtpResult(form.cleaned_data.get("email"), form.cleaned_data.get("otp"))
            if len(userOtp) == 1 and not self.checkExpired(userOtp[0].createDate):
                try:
                    userInfo = User.objects.get(email=form.cleaned_data.get("email"))
                    print(form.cleaned_data.get("password"))
                    userInfo.set_password(form.cleaned_data.get("password"))
                    userInfo.save()
                    userOtp.delete()
                    return HttpResponse(status=200, content="ok")
                except Exception as e:
                    print(e)
                    return HttpResponse(status=500, content="server error")
        
        return HttpResponse(status=401, content="wrong otp")
        
    
class registerUser(View): 
    def post(self, request):
        form = UserRegister(json.loads(request.body))
        
        if form.is_valid():
            
            result, msg = self.checkUserExist(form.cleaned_data)
            if result:
                return HttpResponse(status=400, content=msg)
            try:
                User.objects.create_user(**form.cleaned_data)
            except Exception as e:
                print(e)
                return HttpResponse(status=500, content="server error")
        else:
            print("form error")
            return HttpResponse(status=400, content="bad request")

        return HttpResponse(status=200, content="ok")
    
    def checkUserExist(self, cleanData):
        
        try:
            User.objects.get(username=cleanData.get("username"))
            return (True, "username already exists")
        except ObjectDoesNotExist:
            pass
            
        try: 
            User.objects.get(email=cleanData.get("email"))
            return (True, "email already exists")
        except ObjectDoesNotExist:
            pass
        
        return (False, "ok")
    

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def myAccount(request):
    return HttpResponse(status=200, content="will return your account page after implement")


