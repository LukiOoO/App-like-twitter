from rest_framework import serializers
import pytest
from django.contrib.auth import get_user_model
from users.serializers import FollowersSerializer, YouAreFollowing, UnfollowUserSerializer, SearchUserProfile
from users.serializers import UserCreateSerializer, UserSerializer, ResetPasswordSerializer, FollowUserSerializer

User = get_user_model()


@pytest.mark.django_db
def test_user_create_serializer():
    serializer = UserCreateSerializer(data={
        'nickname': 'testuser',
        'email': 'test@example.com',
        'password': 'asdadasdasdas'
    })

    assert serializer.is_valid(), serializer.errors

    user = serializer.save()
    assert User.objects.filter(nickname='testuser').exists()
    assert User.objects.filter(email='test@example.com').exists()
    assert user.check_password('asdadasdasdas')


@pytest.mark.django_db
def test_user_serializer():
    user = User.objects.create(
        nickname='testuser',
        email='test@example.com',
        avatar='avatar.jpg',
        freeze_or_not=True
    )
    serializer = UserSerializer(instance=user)

    expected_data = {
        'nickname': 'testuser',
        'email': 'test@example.com',
        'avatar': user.avatar.url,
        'freeze_or_not': True
    }

    assert serializer.data == expected_data
    assert 'id' not in serializer.fields
    assert 'slug' not in serializer.fields
    assert 'is_active' not in serializer.fields


@pytest.fixture
def serializer():
    return ResetPasswordSerializer()


def test_serializer_fields(serializer):
    assert isinstance(
        serializer.fields['current_password'], serializers.CharField)
    assert isinstance(serializer.fields['new_password'], serializers.CharField)


def test_serializer_meta(serializer):
    assert serializer.Meta.model == User
    assert serializer.Meta.fields == ['current_password', 'new_password']


@pytest.mark.django_db
def test_followers_serializer():
    user = User.objects.create(nickname='testuser')
    serializer = FollowersSerializer(instance=user)

    expected_data = {
        'follower': (user.nickname, user.id),
    }

    assert serializer.data == expected_data


@pytest.mark.django_db
def test_you_are_following_serializer():
    user = User.objects.create(nickname='testuser')
    serializer = YouAreFollowing(instance=user)

    expected_data = {
        'following': (user.nickname, user.id),
    }

    assert serializer.data == expected_data


@pytest.mark.django_db
def test_unfollow_user_serializer():
    user = User.objects.create(nickname='testuser')
    serializer = UnfollowUserSerializer(
        instance=user, data={'unfollow_user': 123}, partial=True
    )
    assert serializer.is_valid()
    serializer.save()

    user.refresh_from_db()
    assert user.unfollow_user == 123


@pytest.mark.django_db
def test_follow_user_serializer():
    user = User.objects.create(nickname='testuser')
    serializer = FollowUserSerializer(
        instance=user, data={'follow_user': 123}, partial=True
    )
    assert serializer.is_valid()
    serializer.save()

    assert user.follow_user == 123


@pytest.mark.django_db
def test_search_user_profile_serializer():
    user = User.objects.create(
        nickname='testuser', email='John@doe.com', password='djskadhjatestpass')

    serializer = SearchUserProfile(instance=user)

    assert serializer.data['nickname'] == 'testuser'

    assert serializer.data['email'] == 'John@doe.com'
