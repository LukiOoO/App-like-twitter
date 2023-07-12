from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework.viewsets import GenericViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
import logging
from users.models import User
from posts_wall.models import Post
from posts_wall.serializers import ShowUserPostsSerializer
from .models import User
from .serializers import UserSerializer, ResetPasswordSerializer, FollowersSerializer, UnfollowUserSerializer, YouAreFollowing, FollowUserSerializer, SearchUserProfile
from .permissions import IsProfileOwner, FreezeAccountPermission

logging.getLogger(__name__)


class FollowAndUnFollowUserView(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated,
                          IsProfileOwner, FreezeAccountPermission]

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(self.get_response_data(serializer.data))
        except Exception as e:
            return Response(str(e), status=status.HTTP_403_FORBIDDEN)

    def get_follow_unfollow(self, request, f_unf_user_id, message1, message2, message3, options):
        try:
            follow_unfollow_user_id = request.data.get(
                f'{f_unf_user_id}')
            try:
                user_to_follow_unfollow = User.objects.get(
                    id=follow_unfollow_user_id)
            except User.DoesNotExist:
                return Response({'error': 'Invalid user ID'}, status=status.HTTP_400_BAD_REQUEST)
            user = request.user
            if user == user_to_follow_unfollow:
                return Response({'error': f'{message1}'}, status=status.HTTP_400_BAD_REQUEST)
            if options == 1:
                if user_to_follow_unfollow in user.following.all():
                    return Response({'error': f'{message2}'}, status=status.HTTP_400_BAD_REQUEST)
                user.following.add(user_to_follow_unfollow)
            elif options == 2:
                if user_to_follow_unfollow not in user.following.all():
                    return Response({'error': f'{message2}'}, status=status.HTTP_400_BAD_REQUEST)
                user.following.remove(user_to_follow_unfollow)
            return Response({'message': f'{message3}'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_403_FORBIDDEN)

    def get_queryset(self):
        raise NotImplementedError

    def get_serializer_class(self):
        raise NotImplementedError

    def get_response_data(self, data):
        raise NotImplementedError


class FollowersAndFollowingBaseView(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated,
                          IsProfileOwner, FreezeAccountPermission]

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(self.get_response_data(serializer.data))
        except Exception as e:
            return Response(str(e), status=status.HTTP_403_FORBIDDEN)

    def get_queryset(self):
        raise NotImplementedError

    def get_serializer_class(self):
        raise NotImplementedError

    def get_response_data(self, data):
        raise NotImplementedError


class MyUserViewSet(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated,
                          IsProfileOwner, FreezeAccountPermission]

    @action(detail=False, methods=['GET', 'PUT'])
    def me(self, request):
        try:
            try:
                user = User.objects.get(id=request.user.id)
            except User.DoesNotExist:
                raise Response(status=status.HTTP_404_NOT_FOUND)
            if request.method == 'GET':
                serializer = UserSerializer(user)
                return Response(serializer.data)
            elif request.method == 'PUT':
                serializer = UserSerializer(user, data=request.data)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data)
        except Exception as e:
            return Response(str(e), status=status.HTTP_403_FORBIDDEN)


class ResetPassword(APIView):
    serializer_class = ResetPasswordSerializer
    permission_classes = [IsProfileOwner, IsAuthenticated]

    def post(self, request,  uid, token):

        try:
            current_password = request.data.get('current_password')
            new_password = request.data.get('new_password')
            user = request.user
            if not user.check_password(current_password):
                return Response("Invalid current password.", status=status.HTTP_400_BAD_REQUEST)
            elif len(current_password) == 0 or len(new_password) == 0:
                return Response('The field must be filled in', status=status.HTTP_400_BAD_REQUEST)
            user.set_password(new_password)
            user.save()
            return Response("Password changed successfully.", status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_403_FORBIDDEN)


class YourFollowersView(FollowersAndFollowingBaseView):
    def get_queryset(self):
        return self.request.user.followers.all()

    def get_serializer_class(self, *args, **kwargs):
        return FollowersSerializer

    def get_response_data(self, data):
        return {"Your followers": data}


class YourFollowsView(FollowersAndFollowingBaseView):

    def get_queryset(self):
        return self.request.user.following.all()

    def get_serializer_class(self, *args, **kwargs):
        return YouAreFollowing

    def get_response_data(self, data):
        return {"You are following": data}


class FollowUserView(FollowAndUnFollowUserView):

    def get_queryset(self):
        return User.objects.all().exclude(
            id__in=self.request.user.following.all()).exclude(
            id=self.request.user.id)

    def get_serializer_class(self, *args, **kwargs):
        return FollowUserSerializer

    def get_response_data(self, data):
        return {"You can follow": data}

    def post(self, request):
        return self.get_follow_unfollow(request, f_unf_user_id='follow_user',
                                        message1='You cant follow yourself',
                                        message2='You are already following this user',
                                        message3='Successfully followed user',
                                        options=1)


class UnFollowUserView(FollowAndUnFollowUserView):
    def get_queryset(self):
        return self.request.user.following.all()

    def get_serializer_class(self, *args, **kwargs):
        return UnfollowUserSerializer

    def get_response_data(self, data):
        return {"You can unfollow": data}

    def post(self, request):
        return self.get_follow_unfollow(request, f_unf_user_id='unfollow_user',
                                        message1='You cannot unfollow yourself',
                                        message2='You are not following this user',
                                        message3='Successfully unfollowed user',
                                        options=2)


class SearchUserProfile(viewsets.GenericViewSet):
    serializer_class = SearchUserProfile
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated,
                          IsProfileOwner, FreezeAccountPermission]

    def list(self, request, *args, **kwargs):
        user_name = request.query_params.get('user_name')
        try:
            if user_name:
                user = self.queryset.filter(nickname__iexact=user_name).first()
                if user:
                    serializer = self.get_serializer(user)
                    return Response(serializer.data)
                else:
                    return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
            return Response({'detail': 'User name is required.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status=status.HTTP_403_FORBIDDEN)


class UserPosts(viewsets.GenericViewSet):
    queryset = Post.objects.all()
    serializer_class = ShowUserPostsSerializer
    permission_classes = [IsAuthenticated,
                          IsProfileOwner, FreezeAccountPermission]

    def list(self, request, *args, **kwargs):
        try:
            user_name = request.query_params.get('user_name')
            if user_name:
                user = User.objects.filter(nickname__iexact=user_name).first()
                if user:
                    posts = Post.objects.filter(user=user)
                    serializer = self.get_serializer(posts, many=True)
                    return Response(serializer.data)
                return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
            return Response({'detail': 'User name is required.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status=status.HTTP_403_FORBIDDEN)
