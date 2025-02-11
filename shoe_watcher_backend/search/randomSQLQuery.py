from django.db import connection

class randomSQLQuery:

    precentage = 10
    counts = 20
    header_name= ["sfccid", "shoe_name","gender","price","html_link", "img_link" ]
    def __init__(self, percentage=10, counts=20):
        self.precentage = percentage
        self.counts = counts

        

    def makeRandomQuery(self):
        randomQuery = "select sfccid, shoe_name,gender,price::float from shoe_info TABLESAMPLE BERNOULLI ({}) where shoe_name not ilike '%road tested%' and shoe_name not ilike '%shirt%' limit {}".format(self.precentage, self.counts)
        selectRandomShoe = "select si.sfccid, si.shoe_name, si.gender, si.price::float, sl.html_link, sl.img_link from ({}) si inner join shoe_links sl on sl.sfccid = si.sfccid inner join shoe_status st on st.sfccid = si.sfccid".format(randomQuery)
        with connection.cursor() as cursor:
            cursor.execute(selectRandomShoe)
            result = cursor.fetchall()                
            sqlJson = self.listToJson(result)
            return sqlJson
        
    def listToJson(self, result):
        resultList = []
        for idx, item in enumerate(result):

            resultList.append(dict(map(lambda i,j : (i,j) , self.header_name,item)))
        
        return resultList