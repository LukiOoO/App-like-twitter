from django.urls import path
from djoser.views import UserViewSet
from rest_framework.permissions import IsAuthenticated
from .permissions import IsProfileOwner
from .views import MyUserViewSet, ResetPassword
from sending.views import ResendActivationView

urlpatterns = [
    path('auth/users/me/',
         UserViewSet.as_view({'get': 'me'}), name='user-me'),
    path('users/me/',
         MyUserViewSet.as_view({'get': 'me', 'put': 'me'}), name='user-me'),
    path('users/resend_activation/', ResendActivationView.as_view(),
         name='resend-activation'),
    path('password/reset/confirm/<str:uid>/<str:token>/',
         ResetPassword.as_view(), name='reset-password')



]

UserViewSet.permission_classes = [IsAuthenticated, IsProfileOwner]
