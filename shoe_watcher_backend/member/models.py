from django.db import models
from django.contrib.auth import get_user_model
import json

class Login_users(models.Model):
    id = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, unique=True, primary_key=True)
    email = models.EmailField(null=False, blank=False)
    username = models.TextField(null=False, blank=False)
    
    
    class Meta:
        db_table= "user_info"
        # constraints = [
        #     models.UniqueConstraint(
        #         name="uniq_email_user",
        #         fields=["email", "username"]
        #     ),
        # ]

class Password_OTP(models.Model):
    
    email = models.EmailField()
    otp = models.IntegerField()
    used = models.BooleanField()
    createDate = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table="reset_password_otp"
        constraints = [
            models.UniqueConstraint(
                name="uniqueOtp",
                fields=["email"]
            )
        ]

class ClientNotifyListManager(models.Manager):
    def getDict(self):
        return str({"username": self.username.username,
                "email": self.email,
                "shoe_link" : self.shoe_link,
                "sfccid": self.sfccid,
                "price":self.price,
                "last_price": self.last_price
                })
        
        
class Client_Notify_List(models.Model):
    username = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    email = models.EmailField(null=False, blank=False)
    shoe_link = models.TextField(blank=False, null=False)
    sfccid = models.TextField(blank=False, null=False)
    price = models.FloatField(blank=False, null=False)
    last_price = models.FloatField(blank=False, null=False)
    
    def __str__(self):
        return str({"username": self.username.username,
                "email": self.email,
                "shoe_link" : self.shoe_link,
                "sfccid": self.sfccid,
                "price":self.price,
                "last_price": self.last_price
                })
    

    
    class Meta:
        db_table = "notify_subscriber"
        constraints = [
            models.UniqueConstraint(
                name="uniq_email_sfccid",
                fields=["email", "sfccid"]
            ),
        ]
    
    