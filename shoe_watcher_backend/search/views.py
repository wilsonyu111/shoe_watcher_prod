from functools import reduce
import operator
from django.http import HttpResponse
from django.shortcuts import render
import json, os, time
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from .forms import  DeleteEmail, SearchByForm, PaginateFilter, SearchPriceHistory
from django.utils.decorators import method_decorator
from search.models import Notify_Client, ShoeInfo, ShoeLinks, ShoePrice,ShoeStatus
from search.sendEmail import sendEmail
from search.randomSQLQuery import randomSQLQuery
from search.sqlQueries import sqlQueries, sqlQeries_email, sqlQueries_AllPrice
from dotenv import load_dotenv
import threading



# @method_decorator(csrf_exempt, name='dispatch')
class RemoveEmailNotify(View):
    def get(self, request):
        form = DeleteEmail(request.POST)
        if form.is_valid():

            email_to_delete = Notify_Client.objects.filter(
                email__contains=form.data["email"]).delete()
            print(email_to_delete)
        else:
            return HttpResponse(status=400, content="bad request")
        return HttpResponse(status=200, content="deleted")

# @method_decorator(csrf_exempt, name='dispatch')
class searchBy(View):
    def post(self, request):
        form = SearchByForm(json.loads(request.body))
        print(form.data)

        if form.validateInput()[0]:
            print(form.data)

            genders = form.data["gender"]
            shoe_name = form.data["shoe_name"]
            if "default" not in genders:

                x = lambda a : Q(**{'gender__iexact': a} )
                q_args = list(map(x, genders))
                result = ShoeInfo.objects.filter( Q(shoe_name__icontains = shoe_name) & reduce(operator.or_, q_args))
            else:
                result = ShoeInfo.objects.filter( Q(shoe_name__icontains = shoe_name))

            return HttpResponse(status=200, content="found")
        return HttpResponse(status=400, content="bad request")
    
# @method_decorator(csrf_exempt, name='dispatch')
class slideShow(View):
    def get(self, request):
        sql = randomSQLQuery()
        result = sql.makeRandomQuery()
        return HttpResponse(json.dumps({"result": result}), status=200,  content_type="application/json")

# @method_decorator(csrf_exempt, name='dispatch')
class GetInfo(View):
    def post(self, request):
        # time.sleep(10)
        form = SearchByForm(json.loads(request.body))
        validate, msg = form.validateInput()
        if validate:
            print(form.data)

            sorting_style = form.data["sorting_style"]
            sqlObj = sqlQueries(form.data)
            result = sqlObj.makeQuery()

            token_key = token_value = sfccid= ""
            lastRec = []
            if len(result) > 1:
                lastRec = result[-1]
                sfccid = lastRec["sfccid"]
                if sorting_style == "A-Z" or sorting_style == "Z-A":
                    token_key = "shoe_name"
                    token_value = lastRec["shoe_name"]
                else:
                    token_key = "price"
                    token_value = lastRec["price"]

            return HttpResponse(json.dumps({"token_key":token_key, "token_value":token_value,"sfccid":sfccid, "hasNext":sqlObj.hasNext(),"result" : result}), status=200,  content_type="application/json")
        return HttpResponse(status=400, content=msg)
    
# @method_decorator(csrf_exempt, name='dispatch')
class GetPriceHistory(View):
    def post(self, request):  
        form = SearchPriceHistory(json.loads(request.body))
        
        if form.is_valid():
            print(form.data)
            sqlObj = sqlQueries_AllPrice(form.data)
            result = sqlObj.makeQuery()
            
            lowest = []
            highest = []
            label = []
            for i in result:
                lowest.append(i[3])
                highest.append(i[4])
                label.append(i[0])
            jsonResult = {"lowest":lowest, "highest":highest, "label":label}
            print(jsonResult)
            return HttpResponse(json.dumps(jsonResult), status=200, content_type="application/json")
        else:
            return HttpResponse(status=400, content="invalid search")
    
         
         