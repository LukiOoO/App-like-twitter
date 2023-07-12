from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer, UserSerializer as BaseUserSerializer
from rest_framework import serializers
from .models import User
from sending.views import send_activation_email


class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        fields = ['id', 'nickname', 'email', 'password']

    def create(self, validated_data):
        user = super().create(validated_data)
        send_activation_email(user.id)
        return user


class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ['nickname', 'email', 'avatar', 'freeze_or_not']
        read_only_fields = ['id', 'slug', 'is_active',]


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


class SearchUserProfile(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'
