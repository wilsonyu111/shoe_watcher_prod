from rest_framework_simplejwt.serializers import TokenObtainSerializer
# from rest_framework_simplejwt.views import TokenObtainSerializer
from rest_framework_simplejwt.tokens import RefreshToken

class MyTokenObtainPairSerializer(TokenObtainSerializer):
    token_class = RefreshToken

    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        refresh["user"] = self.user.username # here you can add custom cliam
        refresh["email"] = self.user.email

        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)

        return data