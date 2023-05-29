import pytest
from users.models import User
from django.test import RequestFactory
from users.permissions import IsProfileOwner


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
