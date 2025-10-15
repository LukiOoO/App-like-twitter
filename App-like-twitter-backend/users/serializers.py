from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer, UserSerializer as BaseUserSerializer
from rest_framework import serializers
from .models import User
from sending.views import send_activation_email
from django.conf import settings
from comments.models import Comments
from django.utils.encoding import force_str, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


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
        fields = ['nickname', 'email', 'avatar', 'freeze_or_not', 'id']
        read_only_fields = ['slug', 'is_active',]


class ResetPasswordConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({
                'confirm_password': 'Passwords do not match.'
            })

        uid = self.context['uid']
        token = self.context['token']

        try:
            uid_decoded = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=uid_decoded)
        except (DjangoUnicodeDecodeError, User.DoesNotExist):
            raise serializers.ValidationError({'uid': 'Invalid UID.'})

        if not default_token_generator.check_token(user, token):
            raise serializers.ValidationError(
                {'token': 'Invalid or expired token.'})

        attrs['user'] = user
        return attrs

    def save(self, **kwargs):
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


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


class SearchUserEmailerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'email'
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
