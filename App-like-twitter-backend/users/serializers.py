from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer, UserSerializer as BaseUserSerializer
from rest_framework import serializers
from .models import User
from sending.views import send_activation_email


class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        fields = ['id', 'nickname', 'email', 'password']

    def create(self, validated_data):
        user = super().create(validated_data)
        send_activation_email(user)
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
