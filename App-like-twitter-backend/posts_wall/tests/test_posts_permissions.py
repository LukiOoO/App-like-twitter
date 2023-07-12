from rest_framework.test import APIRequestFactory
import pytest
from posts_wall.permissions import IsProfileOwnerPostMg
from posts_wall.views import UserPostManager
from posts_wall.models import Post
from posts_wall.permissions import IsProfileOwnerPostMg
from users.models import User


@pytest.mark.django_db
class TestIsProfileOwnerPostMg:
    def test_has_object_permission_returns_true_for_profile_owner(self):
        factory = APIRequestFactory()
        user = User.objects.create(nickname='test_user', email='xd1@xd.com')
        post = Post.objects.create(user=user)

        request = factory.get('/show_user_posts/1/')
        request.user = user

        permission = IsProfileOwnerPostMg()
        has_permission = permission.has_object_permission(
            request, UserPostManager(), post)

        assert has_permission is True

    def test_has_object_permission_returns_false_for_non_profile_owner(self):
        factory = APIRequestFactory()
        user1 = User.objects.create(nickname='user1', email='xd2@xd.com')
        user2 = User.objects.create(nickname='user2', email='xd3@xd.com')
        post = Post.objects.create(user=user1)

        request = factory.get('/show_user_posts/1/')
        request.user = user2

        permission = IsProfileOwnerPostMg()
        has_permission = permission.has_object_permission(
            request, UserPostManager(), post)

        assert has_permission is False
