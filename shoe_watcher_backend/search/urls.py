from django.urls import path


from . import views

urlpatterns = [

    path("deleteNotify/", views.RemoveEmailNotify.as_view()),
    path("searchby/", views.searchBy.as_view()),
    path("getInfo/", views.GetInfo.as_view()),
    path("slideShow/", views.slideShow.as_view()),
    path("searchPriceHistory/", views.GetPriceHistory.as_view()),
    
]
