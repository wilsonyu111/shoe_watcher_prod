from django.db import connection
import copy, json

class sqlQueries:

    limit=35
    sorting_style=""
    genderList=None
    shoe_name=""
    result=None
    sqlJson=None
    paginateStr=None
    requestDict=None
    sortOrder= ""
    min_price = 0
    max_price = 0
    
    header_name= ["sfccid", "shoe_name","gender","price","shoe_style", "html_link", "img_link","in_stock", "online_status" ]
    sorting = {
            "A-Z":("si.shoe_name asc, si.sfccid asc",">"),
            "Z-A":("si.shoe_name desc, si.sfccid desc", "<"),
            "$-$$":("si.price asc, si.sfccid asc", ">"),
            "$$-$":("si.price desc, si.sfccid desc", "<"),
            }
    def __init__(self,requestDict):
        self.limit=requestDict.get("search_limit")
        self.shoe_name=requestDict.get("shoe_name")
        self.sorting_style=requestDict.get("sorting_style")
        self.sortOrder = self.sorting.get(self.sorting_style)[1]
        self.genderList=requestDict.get("gender")
        self.conditionList=set(requestDict.get("condition"))
        self.requestDict = requestDict

    
  
        

    def builtSql(self, genderLimit=False, paginate=False, conditionLimit=False):
        
        orderBy = "order by {}".format(self.sorting[self.sorting_style][0])
        searchShoe = "where si.shoe_name ilike %(shoe_name)s"
        findAllShoe = "select si.sfccid, si.shoe_name, si.gender, si.price::float,  si.shoe_style, sl.html_link, sl.img_link, st.in_stock, st.online_status from shoe_info si inner join shoe_links sl on sl.sfccid = si.sfccid inner join shoe_status st on st.sfccid = si.sfccid"
        search_price = "and si.price >= %(min_price)s and si.price <= %(max_price)s"
        limitStr = "limit {}".format(self.limit+1)
        paginateStr = ""
        genderOption = ""
        conditionOption = ""
        if genderLimit == True:
            genderOption = 'and si.gender ~* %(genderCheck)s'
            
        if conditionLimit == True:
            if len(self.conditionList) == 1 and "New" in self.conditionList: 
                conditionOption = "and not si.shoe_name ilike \'%%road%%test%%\'"
            elif len(self.conditionList) == 1 and "Road-tested" in self.conditionList:
                conditionOption = "and si.shoe_name ilike \'%%road%%test%%\'"

        if paginate:
            paginateStr = "and (si.{}, si.sfccid) {} (%(token_value)s, %(sfccid)s)".format(self.requestDict.get("token_key"), self.sortOrder)
        
        return "{} {} {} {} {} {} {}".format(findAllShoe, searchShoe, search_price, genderOption, conditionOption,paginateStr, orderBy, limitStr)
    
    def makeQuery(self):
        paramDict = copy.deepcopy(self.requestDict)
        paramDict.update({"shoe_name":"%{}%".format(self.shoe_name)})
        genderLimit=False
        conditionLimit=False
        paginate = False
        if "default" not in self.genderList:
            if len(self.genderList) > 1:
                genderCheck = "|".join(list(map(lambda a : "^{}$".format(a), self.genderList)))
            else:
                genderCheck = "^{}$".format(self.genderList[0])
            genderLimit=True
            paramDict.update({"genderCheck":"{}".format(genderCheck)})
        
        if "default" not in self.conditionList:
            conditionLimit=True

        if "token_value" in self.requestDict and "token_key" in self.requestDict and "sfccid" in self.requestDict:
            paginate = True
            paramDict.update(
                {
                    "token_value":"{}".format(self.requestDict.get("token_value")),
                    "sfccid":"{}".format(self.requestDict.get("sfccid")),                
                })

        with connection.cursor() as cursor:
            queryStr = self.builtSql(genderLimit=genderLimit, paginate=paginate, conditionLimit=conditionLimit)
            cursor.execute(
                    queryStr, paramDict)
            self.result = cursor.fetchall()
            print("length: ",len(self.result))
                
            sqlJson = self.listToJson()
            return sqlJson


    def hasNext(self):
        return self.limit < len(self.result)


    def listToJson(self):
        sqlJson = []
        for idx, item in enumerate(self.result):

            if idx < self.limit:
                sqlJson.append(dict(map(lambda i,j : (i,j) , self.header_name,item)))
        
        return sqlJson
    
class sqlQeries_email:
    table_columns = ["shoe_link", "sfccid", "price", "last_price", "email"]
    value_list = ["%(html_link)s", "%(sfccid)s","%(price)s","%(price)s","%(email)s"]
    conflict_name = "uniq_email_sfccid"
    sql = '''
        insert into search_client_notify_list ({}) 
        values({}) 
        on conflict ON constraint {}
        do update set price = excluded.price, 
        last_price = excluded.last_price'''
    paramDict = None
    
        
    def __init__(self, paramDict):
        
        self.paramDict = paramDict
    
    def makeQuery(self):
        with connection.cursor() as cursor:
            queryStr = self.builtSql()
            cursor.execute(
                    queryStr, self.paramDict)
        
    def builtSql(self):
        return self.sql.format(
            ",".join(self.table_columns), 
            ",".join(self.value_list), 
            self.conflict_name)
        

class sqlQueries_AllPrice:
    paramDict = None
    def __init__(self, paramDic):
        self.paramDict = paramDic
    
    inner_table_sql = '''
        select price as price, EXTRACT(MONTH FROM update_date) as mth, EXTRACT(YEAR FROM update_date) as yr 
        from shoe_price where sfccid ilike %(sfccid)s order by update_date asc'''
    
    outer_table_sql = '''
        select distinct TO_CHAR(TO_DATE (tbl.mth::text, 'MM'), 'Mon') AS month_name,
        tbl.mth::integer as month, 
        tbl.yr::integer as year, 
        min(tbl.price) over(partition by tbl.mth, tbl.yr) :: float, 
        max(tbl.price) over(partition by tbl.mth, tbl.yr) :: float
        from ({}) tbl
        order by year, month asc'''
    
    def makeQuery(self):
        with connection.cursor() as cursor:
            queryStr = self.builtSql()
            print(queryStr)
            cursor.execute(queryStr, self.paramDict)
            result = cursor.fetchall()
        
        
        
        return result
            
    def builtSql(self):
        return self.outer_table_sql.format(self.inner_table_sql)
        
        
        
class sqlQueries_Filter_Subscribe:
    
    def __init__(self, username_id):
        self.username_id = username_id
        self.fieldName = ["email", "sfccid", "target_price", "previous_target_price", 
        "shoe_link", "shoe_name", "gender", "brand", "update_date", "row_id", "username_id"]
        self.queryStr = '''
        with t1 as (
        select email, sfccid, shoe_link, price as target_price, 
        last_price as previous_target_price, id as row_id, username_id as username_id
        from notify_subscriber
        where username_id = %(username_id)s)
        select 
        email, t1.sfccid, target_price, previous_target_price, 
        shoe_link, shoe_name, gender, brand, to_char(update_date, 'mm/dd/yyyy - HH24:MI:SS'), t1.row_id, t1.username_id
        from t1
        join shoe_info on t1.sfccid = shoe_info.sfccid
        '''
    
    def makeQuery(self):
        with connection.cursor() as cursor:
            cursor.execute(self.queryStr, {"username_id": self.username_id})
            result = cursor.fetchall()
            
        return self.jsonData(result)
            
    
    def jsonData(self, dataList):
        dictList = []
        
        for data in dataList:
            dictList.append(dict(zip(self.fieldName, list(data))))
            
        return json.dumps({"data" : dictList})