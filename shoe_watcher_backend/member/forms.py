from django import forms
from django.core.exceptions import ValidationError
    
    
class UserRegister(forms.Form):
    email = forms.EmailField()
    username = forms.CharField()
    password = forms.CharField()
    
class SubscribeList(forms.Form):
    email = forms.EmailField()
    username = forms.CharField()
    
class editUserInfo(forms.Form):
    oldUser = forms.CharField()
    oldEmail = forms.EmailField()
    email = forms.EmailField()
    username = forms.CharField()
    password = forms.CharField()
    
class DeleteSubItem(forms.Form):
    id = forms.IntegerField()
    sfccid = forms.CharField()
    username_id = forms.IntegerField()

    
class ResetPasswordEmail(forms.Form):
    email = forms.EmailField()
    
    
class Checkotp(forms.Form):
    otp = forms.IntegerField()
    email = forms.EmailField()
    
class SubmitReset(Checkotp):
    password = forms.CharField()
    
class EmailNotifyForm(forms.Form):
    email = forms.EmailField()
    html_link = forms.CharField()
    sfccid = forms.CharField()
    price = forms.DecimalField()
    shoe_name = forms.CharField()
    username= forms.CharField()

    def validateInput(self):
        if not self.is_valid():
            return (False, "invalid input")

        if not isinstance(self.data["price"], int) and not isinstance(self.data["price"], float):
            return (False, "invalid price")
    

        return (True, "ok")
    