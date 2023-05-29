from django.contrib.auth.models import AnonymousUser
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate
from users.views import MyUserViewSet
from users.models import User
import pytest
from rest_framework.exceptions import NotFound
from users.views import ResetPassword


factory = APIRequestFactory()


@pytest.mark.django_db
def test_my_user_view_set_get_me():
    view = MyUserViewSet()
    request = factory.get('/users/me/')
    request.user = AnonymousUser()

    with pytest.raises(NotFound):
        view.me(request)


@pytest.mark.django_db
def test_my_user_view_set_put_me():
    view = MyUserViewSet()
    request = factory.put('/users/me/', {'nickname': 'new_nickname'})
    user = User.objects.create(nickname='test_user', freeze_or_not=True)
    request.user = user

    response = view.me(request)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data['message'] == 'Your account is frozen'


@pytest.fixture
def api_rf():
    return APIRequestFactory()


@pytest.fixture
def user_factory(db):
    def create_user(**kwargs):
        return User.objects.create_user(**kwargs)
    return create_user


@pytest.mark.django_db
def test_reset_password(api_rf, user_factory):
    user = user_factory(nickname='testuser',
                        email='sx@ssx.com', password='testpassword')

    factory = APIRequestFactory()
    request = factory.post('/reset-password/uid/token/', {
        'current_password': 'testpassword',
        'new_password': 'newpassword'
    })
    force_authenticate(request, user=user)

    view = ResetPassword.as_view()

    response = view(request, uid='uid', token='token')

    assert response.status_code == status.HTTP_200_OK

    user.refresh_from_db()
    assert user.check_password('newpassword')
