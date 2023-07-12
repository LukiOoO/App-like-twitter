from django.urls import path
from djoser.views import UserViewSet
from rest_framework.permissions import IsAuthenticated
from .permissions import IsProfileOwner, FreezeAccountPermission
from .views import MyUserViewSet, ResetPassword, YourFollowersView, YourFollowsView, FollowUserView, UnFollowUserView, SearchUserProfile, UserPosts
from sending.views import ResendActivationView

urlpatterns = [
    path('auth/users/me/',
         UserViewSet.as_view({'get': 'me'}), name='user-me-auth'),
    path('users/me/',
         MyUserViewSet.as_view({'get': 'me', 'put': 'me'}), name='user-me'),
    path('users/resend_activation/', ResendActivationView.as_view(),
         name='resend-activation'),
    path('password/reset/confirm/<str:uid>/<str:token>/',
         ResetPassword.as_view(), name='reset-password'),
    path('your-followers/',
         YourFollowersView.as_view({'get': 'list'}), name='followers'),
    path('you-are-following/',
         YourFollowsView.as_view({'get': 'list'}), name='following'),
    path('you-can-follow/',
         FollowUserView.as_view({'get': 'list'}), name='you-can-follow'),
    path('you-can-unfollow/',
         UnFollowUserView.as_view({'get': 'list'}), name='you-can-unfollow'),
    path('search-user-profile/',
         SearchUserProfile.as_view({'get': 'list'}), name='search-user-profile'),
    path('search-user-posts/',
         UserPosts.as_view({'get': 'list'}), name='user-posts'),


]

UserViewSet.permission_classes = [
    IsAuthenticated, IsProfileOwner, FreezeAccountPermission]
