from sending.views import ResendActivationView
from rest_framework.test import APIClient
from django.urls import reverse
from sending.views import ActivationView
from rest_framework import status
from django.http import HttpRequest
import pytest
from django.core import mail
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from sending.views import send_activation_email
from django.conf import settings

User = get_user_model()


@pytest.mark.django_db
def test_send_activation_email():
    user = User.objects.create_user(
        nickname='testuser', email='testuser@example.com', password='test123')
    user.nickname = 'Test User'
    user.save()

    send_activation_email(user)

    assert len(mail.outbox) == 1

    sent_email = mail.outbox[0]
    assert sent_email.subject == 'Account activation'
    assert sent_email.from_email == settings.DEFAULT_FROM_EMAIL
    assert sent_email.to == ['testuser@example.com']
    assert 'Hello Test User' in sent_email.body
    assert 'To activate your account' in sent_email.body
    assert 'href' in sent_email.body
    assert 'text/html' in sent_email.alternatives[0][1]


User = get_user_model()


@pytest.mark.django_db
def test_activation_view():
    user = User.objects.create_user(
        nickname='testuser', email='testuser@example.com', password='test123')
    user_id = user.id

    token = default_token_generator.make_token(user)

    request = HttpRequest()
    request.user = user

    view = ActivationView()

    kwargs = {'uid': user_id, 'token': token}

    response = view.get(request, **kwargs)

    assert response.status_code == status.HTTP_200_OK

    assert response.data == {'message': 'Account activated'}

    user.refresh_from_db()
    assert not user.freeze_or_not

    invalid_token = 'invalid_token'
    kwargs['token'] = invalid_token
    response = view.get(request, **kwargs)

    assert response.status_code == status.HTTP_404_NOT_FOUND

    assert response.data == {'message': 'Invalid token'}

    user.refresh_from_db()
    assert not user.freeze_or_not


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def test_user(db):
    user = User.objects.create_user(
        nickname='testuser', password='testpass', email='test@example.com')
    user.freeze_or_not = True
    user.save()
    return user


def test_resend_activation_success(api_client, test_user):
    url = reverse('resend-activation')
    data = {'email': test_user.email}
    api_client.force_authenticate(user=test_user)
    response = api_client.post(url, data, format='json')

    assert response.status_code == status.HTTP_200_OK
    assert response.data['detail'] == 'The email was sent again'


def test_resend_activation_user_not_exist(api_client, test_user):
    url = reverse('resend-activation')
    data = {'email': 'nonexistent@example.com'}
    api_client.force_authenticate(user=test_user)
    response = api_client.post(url, data, format='json')

    assert response.status_code == status.HTTP_200_OK
    assert response.data['detail'] == 'User with this email does not exist'


def test_resend_activation_account_not_frozen(api_client, test_user):
    url = reverse('resend-activation')
    data = {'email': test_user.email}
    test_user.freeze_or_not = False
    test_user.save()
    api_client.force_authenticate(user=test_user)
    response = api_client.post(url, data, format='json')

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data['detail'] == 'Your account is not frozen.'


def test_resend_activation_anonymous_user(api_client):
    url = reverse('resend-activation')
    data = {'email': 'test@example.com'}
    response = api_client.post(url, data, format='json')

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert 'detail' in response.data


@pytest.mark.django_db
def test_resend_activation_email():
    view = ResendActivationView()
    user = User.objects.create_user(
        nickname='testuser', email='test@example.com', password='xddd')
    view.resend_activation_email(user)

    # Check if the email was sent
    assert len(mail.outbox) == 1

    # Check email contents
    email = mail.outbox[0]
    assert email.subject == 'Account re-activation'
    assert email.from_email == settings.DEFAULT_FROM_EMAIL
    assert email.to == [user.email]
    assert '<a href=' in email.body
    assert user.nickname in email.body
