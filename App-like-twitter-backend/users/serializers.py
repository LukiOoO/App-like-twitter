from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer, UserSerializer as BaseUserSerializer
from rest_framework import serializers
from .models import User
from sending.views import send_activation_email
from django.conf import settings
from comments.models import Comments


class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        fields = ['id', 'nickname', 'email', 'password']

    def create(self, validated_data):
        user = super().create(validated_data)
        send_activation_email(user.id)
        return user

class UserAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['avatar']


class UserSerializer(BaseUserSerializer):
    avatar = serializers.SerializerMethodField()

    def get_avatar(self, obj):
        if obj.avatar:  
            return f"{settings.BASE_URL}{obj.avatar.url}"
        return None  
    
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ['nickname', 'email', 'avatar', 'freeze_or_not','id']
        read_only_fields = [ 'slug', 'is_active',]


class ResetPasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(
        max_length=128, write_only=True, style={'input_type': 'password'})
    new_password = serializers.CharField(
        max_length=128, write_only=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['current_password', 'new_password']


class FollowersSerializer(serializers.ModelSerializer):

    follower = serializers.SerializerMethodField()

    def get_follower(self, obj):
        return obj.nickname, obj.id

    class Meta:
        model = User
        fields = ['follower']


class YouAreFollowing(serializers.ModelSerializer):
    following = serializers.SerializerMethodField()

    def get_following(self, obj):
        return obj.nickname, obj.id

    class Meta:
        model = User
        fields = ['following']


class UnfollowUserSerializer(serializers.ModelSerializer):
    unfollow_user = serializers.IntegerField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'is_active', 'nickname', 'email', 'avatar',
                  'freeze_or_not', 'unfollow_user']
        read_only_fields = ['id', 'is_active', 'nickname', 'email', 'avatar',
                            'freeze_or_not']


class FollowUserSerializer(serializers.ModelSerializer):
    follow_user = serializers.IntegerField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'is_active', 'nickname', 'email', 'avatar',
                  'freeze_or_not', 'follow_user']
        read_only_fields = ['id', 'is_active', 'nickname', 'email', 'avatar',
                            'freeze_or_not']


class SearchUserProfileSerializer(serializers.ModelSerializer):
    user_followers = serializers.SerializerMethodField()

    def get_user_followers(self, obj):
        return obj.followers.values_list('id', flat=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'nickname', 'avatar',
            'is_active', 'freeze_or_not', 'user_followers', 'following', 'last_login'
        ]

class UserCommentsSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(read_only=True)
    post_id = serializers.SerializerMethodField()

    def post_id(self):
        post_id = self.context['post_id']
        return post_id

    def get_user(self, obj):
        user = obj.user.id
        return user

    class Meta:
        model = Comments
        fields = ['id', 'user', 'text', 'post_id',
                  'image', 'video', 'gif', 'created_at']

