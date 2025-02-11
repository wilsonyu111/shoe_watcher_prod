from django.contrib import admin
from django.urls import include, path
from . import views

from django.urls import path, re_path
from django.conf import settings
from shoe_watcher.views import serve_react
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path("search/", include("search.urls")),
    path('profile/', views.profile, name="profile"),
    path('member/', include('member.urls')),
    path('member/', include('django.contrib.auth.urls')),
    # path('', views.index, name="index"),
    re_path(r"^(?P<path>.*)$", serve_react, {"document_root": settings.REACT_APP_BUILD_PATH}),
    
]
