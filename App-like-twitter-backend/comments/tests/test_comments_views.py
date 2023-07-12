import pytest
from django.contrib.auth.models import AnonymousUser, User
from django.test import RequestFactory
from rest_framework.test import APIRequestFactory
from rest_framework import status
from comments.models import Comments
from comments.serializers import CommentsSerializer
from comments.views import PostCommentsViews
from users.permissions import IsAnonymousUser
from rest_framework.permissions import IsAuthenticated
from users.permissions import FreezeAccountPermission
from posts_wall.permissions import IsProfileOwnerPostMg

pytestmark = pytest.mark.django_db


@pytest.fixture
def factory():
    return RequestFactory()


@pytest.fixture
def api_factory():
    return APIRequestFactory()


@pytest.fixture
def user():
    return User.objects.create(username='testuser')


@pytest.fixture
def comment():
    return Comments.objects.create(content='Test comment')


@pytest.fixture
def viewset(api_factory, factory):
    request = api_factory.get('/comments/')
    view = PostCommentsViews()
    view.action = 'list'
    view.request = request
    view.format_kwarg = None
    view.kwargs = {'show_user_posts_pk': 1}
    view.request.user = AnonymousUser()
    view.serializer_context = view.get_serializer_context()
    view.serializer_class = CommentsSerializer
    view.queryset = Comments.objects.all()
    return view


def test_get_queryset(viewset):
    queryset = viewset.get_queryset()
    assert len(queryset) == 0


def test_get_serializer_context(viewset):
    serializer_context = viewset.get_serializer_context()
    assert serializer_context == {'post_id': 1, 'user_id': None}


def test_get_permissions_list_action(viewset):
    permissions = viewset.get_permissions()
    assert len(permissions) == 1
    assert isinstance(permissions[0], IsAnonymousUser)


def test_get_permissions_other_actions(viewset):
    viewset.action = 'create'
    permissions = viewset.get_permissions()
    assert len(permissions) == 3
    assert isinstance(permissions[0], IsAuthenticated)
    assert isinstance(permissions[1], IsProfileOwnerPostMg)
    assert isinstance(permissions[2], FreezeAccountPermission)
