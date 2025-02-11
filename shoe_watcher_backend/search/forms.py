from typing import Any
from django import forms
from django.core.exceptions import ValidationError
from pydantic import BaseModel, Field

class signup_data(BaseModel):
    email: str
    price: float = Field(gt=-1)
    last_price: float = Field(gt=-1)
    html_link: str 
    sfccid: str

class EmailNotifyForm(forms.Form):
    email = forms.EmailField(required=True)
    html_link = forms.CharField(required=True)
    sfccid = forms.CharField(required=True)
    price = forms.DecimalField()
    shoe_name = forms.CharField(required=True)

    def validateInput(self):
        if not self.is_valid():
            return (False, "invalid input")

        if not isinstance(self.data["price"], int) and not isinstance(self.data["price"], float):
            return (False, "invalid price")
    

        return (True, "ok")

class DeleteEmail(forms.Form):
    email = forms.CharField()

class SearchByForm(forms.Form):
    gender = forms.CharField(required=True)
    condition = forms.CharField(required=True)
    shoe_name = forms.CharField(required=True)
    search_limit = forms.NumberInput()
    max_price = forms.NumberInput()
    min_price = forms.NumberInput()
    sorting_style = forms.CharField(required=True)
    token_key = forms.CharField(required=False)
    token_value = forms.CharField(required=False)
    sfccid = forms.CharField(required=False)
    globalMaxSearchLimit = 100
    sorting = {"A-Z","Z-A","$-$$","$$-$",}
    sortingColumn = {"shoe_name", "price"}

    def validateInput(self):



        if not self.is_valid():
            return (False, "invalid input")
        

        if self.data["sorting_style"] not in self.sorting:
            return (False,"invalid sorting style")
        
        searchLimit = self.data.get("search_limit")
        if not isinstance(searchLimit, int) or searchLimit > self.globalMaxSearchLimit or searchLimit < 0:
            return (False, "search limit is invalid, max is {}".format(self.globalMaxSearchLimit) )
        
        minPrice = self.data.get("min_price")
        maxPrice = self.data.get("max_price")
        if not isinstance(minPrice, int) or not isinstance(maxPrice, int) :
            return (False, "invalid price".format(self.globalMaxSearchLimit))


        return (True,"ok")
    
    def validatePaginate(self):
        
        basic_input_ok, basic_input_msg = self.validateInput()
        if not basic_input_ok:
            return (basic_input_ok, basic_input_msg)

        if "token_key" not in self.data or self.data["token_key"] == "":
            return (False, "token key cannot be empty")
        
        if "token_key" in self.data and self.data.get("token_key") not in self.sortingColumn:
            return (False, "column is not supported for sorting")
        
        if "token_value" in self.data and self.data["token_value"] == "":
            return (False, "token value cannot be empty")
        
        if "sfccid" in self.data and self.data["sfccid"] == "":
            return (False, "sfccid cannot be empty")

class SearchPriceHistory(forms.Form):
    sfccid = forms.CharField(required=True)
    
class PaginateFilter(forms.Form):
    gender = forms.CharField()
    shoe_name = forms.CharField()
    search_limit = forms.NumberInput()
    token_key = forms.CharField()
    token_value = forms.CharField()
    sfccid = forms.CharField()
    sorting_style = forms.CharField()