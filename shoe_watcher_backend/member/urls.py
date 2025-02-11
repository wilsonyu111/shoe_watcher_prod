from django.urls import include, path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import MyTokenObtainPairView


urlpatterns = [
    path("test_data/", views.test_data),
    # path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_custom'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("logout/", views.logout),
    path("my_account/", views.myAccount),
    path("register/", views.registerUser.as_view()),
    path("reset_password/", views.resetPasswordRequest.as_view()),
    path("submit_reset/", views.resetPass.as_view()),
    path("check_otp/", views.otpVerify.as_view()),
    path("signupNotify/", views.SetEmailNotify.as_view()),
    path("get_subscribe/", views.getSubscribeList.as_view()),
    path("delete_subscribe/", views.deleteSubscribeItem.as_view()),
    path("update_info/", views.updateUserInfo.as_view()),
]
