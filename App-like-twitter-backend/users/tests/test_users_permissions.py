from django.test import RequestFactory
from django.contrib.auth.models import AnonymousUser
from rest_framework.exceptions import PermissionDenied as DRFPermissionDenied
import pytest
from users.models import User
from users.permissions import IsProfileOwner, IsAnonymousUser, FreezeAccountPermission


@pytest.mark.django_db
@pytest.fixture
def factory():
    return RequestFactory()


@pytest.mark.django_db
@pytest.fixture
def permission():
    return IsProfileOwner()


@pytest.mark.django_db
@pytest.fixture
def user():
    return User.objects.create(email='test_user@example.com', nickname='test_user')


@pytest.mark.django_db
@pytest.fixture
def other_user():
    return User.objects.create(email='other_user@example.com', nickname='other_user')


@pytest.mark.django_db
def test_has_object_permission_with_same_user(factory, permission, user):
    request = factory.get('/')
    request.user = user

    assert permission.has_object_permission(request, None, user) is True


@pytest.mark.django_db
def test_has_object_permission_with_different_user(factory, permission, user, other_user):
    request = factory.get('/')
    request.user = user

    assert permission.has_object_permission(request, None, other_user) is False


@pytest.mark.django_db
def test_is_anonymous_user_permission():
    permission = IsAnonymousUser()
    factory = RequestFactory()

    request = factory.get('/')
    request.user = AnonymousUser()
    assert permission.has_object_permission(request, None, None)

    request = factory.post('/')
    request.user = AnonymousUser()
    assert not permission.has_object_permission(request, None, None)

    request = factory.get('/')
    request.user = User.objects.create(
        nickname='testuser1', email='testuser1@example.com')
    assert permission.has_object_permission(request, None, None)

    request = factory.post('/')
    request.user = User.objects.create(
        nickname='testuser2', email='testuser2@example.com')
    assert permission.has_object_permission(request, None, None)


@pytest.mark.django_db
def test_freeze_account_permission():
    permission = FreezeAccountPermission()
    factory = RequestFactory()

    request = factory.get('/')
    user = User.objects.create(
        nickname='testuser1', email='testemail1@test.com', freeze_or_not=False)
    request.user = user
    assert permission.has_permission(request, None)

    request = factory.get('/')
    user = User.objects.create(
        nickname='testuser2', email='testemail2@test.com', freeze_or_not=True)
    request.user = user
    with pytest.raises(DRFPermissionDenied) as exc_info:
        permission.has_permission(request, None)
    assert str(exc_info.value) == 'Your account is frozen'
