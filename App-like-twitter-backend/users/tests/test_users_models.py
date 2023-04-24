import pytest
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
def test_create_user():
    email = 'testuser@example.com'
    nickname = 'testuser'
    password = 'testpassword'
    user = User.objects.create_user(
        email=email, nickname=nickname, password=password)
    assert user.email == email
    assert user.nickname == nickname
    assert user.check_password(password)


@pytest.mark.django_db
def test_create_superuser():
    email = 'admin@example.com'
    nickname = 'admin'
    password = 'adminpassword'
    superuser = User.objects.create_superuser(
        email=email, nickname=nickname, password=password)
    assert superuser.email == email
    assert superuser.nickname == nickname
    assert superuser.is_staff == True
    assert superuser.admin == True
    assert superuser.check_password(password)


@pytest.mark.django_db
def test_user_creation():
    User = get_user_model()
    email = "test@example.com"
    nickname = "testuser"
    password = "testpass123"
    user = User.objects.create_user(
        email=email, nickname=nickname, password=password
    )
    assert user.email == email
    assert user.nickname == nickname
    assert user.check_password(password)
    assert str(user) == nickname
    assert user.slug == nickname
    assert user.is_active
    assert not user.is_staff
    assert not user.admin
    assert list(user.groups.all()) == []
