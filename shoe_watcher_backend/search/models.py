from django.db import models
from django.contrib.auth import get_user_model

class ShoeInfo(models.Model):
    shoe_id = models.TextField(blank=True, null=True)
    sfccid = models.TextField(primary_key=True)
    shoe_name = models.TextField(blank=True, null=True)
    brand = models.TextField(blank=True, null=True)
    gender = models.TextField(blank=True, null=True)
    update_date = models.TextField(blank=True, null=True)
    shoe_type = models.TextField(blank=True, null=True)
    lists = models.TextField(blank=True, null=True)
    shoe_style = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'shoe_info'
    def __str__(self) -> str:
        return "{0},{1},{2},{3},{4},{5},{6},{7},{8}".format(self.shoe_id, 
                         self.sfccid, 
                         self.shoe_name, 
                         self.brand, 
                         self.gender, 
                         self.update_date, 
                         self.shoe_style,
                         self.shoe_type,
                         self.price)

class ShoeLinks(models.Model):
    shoe_id = models.TextField(blank=True, null=True)
    sfccid = models.TextField(primary_key=True)
    update_date = models.TextField(blank=True, null=True)
    html_link = models.TextField(blank=True, null=True)
    img_link = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'shoe_links'


class ShoePrice(models.Model):
    shoe_id = models.TextField(blank=True, null=True)
    sfccid = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    update_date = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'shoe_price'


class ShoeStatus(models.Model):
    shoe_id = models.TextField(blank=True, null=True)
    sfccid = models.TextField(primary_key=True)
    price = models.DecimalField(max_digits=65535, decimal_places=65535, blank=True, null=True)
    in_stock = models.TextField(blank=True, null=True)
    update_date = models.TextField(blank=True, null=True)
    shoe_style = models.TextField(blank=True, null=True)
    online_status = models.TextField(blank=True, null=True)
    product_status = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'shoe_status'


class Notify_Client(models.Model):
    email = models.CharField(
        max_length=250, null=False, blank=False, primary_key=True)

    
