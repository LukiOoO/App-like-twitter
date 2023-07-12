from django.core import mail
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
import pytest
from sending.views import send_activation_email
from users.models import User


@pytest.mark.django_db
def test_send_activation_email():
    user = User.objects.create_user(
        nickname='testuser', password='testpassword', email='test@example.com')

    send_activation_email(user.id)

    assert len(mail.outbox) == 1

    email = mail.outbox[0]
    assert email.subject == 'Account activation'
    assert email.from_email == settings.DEFAULT_FROM_EMAIL
    assert email.to == [user.email]

    assert '<html>' in email.alternatives[0][0]
    assert 'Hello' in email.alternatives[0][0]
    assert user.nickname in email.alternatives[0][0]
    assert 'activate your account, click on the link below:' in email.alternatives[0][0]
    assert settings.BASE_URL in email.alternatives[0][0]
    activation_url = f"/activate/{urlsafe_base64_encode(force_bytes(user.pk))}/{default_token_generator.make_token(user)}"
    assert activation_url in email.alternatives[0][0]


@pytest.mark.django_db
def test_activation_view(api_client, user_factory):
    user = user_factory.create(freeze_or_not=True)

    token = default_token_generator.make_token(user)

    uid_bytes = force_bytes(user.id)

    uid_encoded = urlsafe_base64_encode(uid_bytes).encode('utf-8')

    url = reverse('activate',
                  kwargs={'uid': uid_encoded, 'token': token})

    api_client.force_authenticate(user=user)

    response = api_client.get(url)

    assert response.status_code == status.HTTP_200_OK

    user.refresh_from_db()
    assert user.freeze_or_not is False

    assert response.data['message'] == "Account activated"


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user_factory():
    class UserFactory:
        def create(self, freeze_or_not=False):
            return User.objects.create(nickname='testuser', email='test@example.com', freeze_or_not=freeze_or_not)

    return UserFactory()


@pytest.mark.django_db
def test_resend_activation_view():
    client = APIClient()

    user = User.objects.create(
        email='test@example.com', nickname='TestUser', freeze_or_not=True)

    client.force_authenticate(user=user)
    url = reverse('resend-activation')
    data = {'email': 'test@example.com'}
    response = client.post(url, data, format='json')

    assert response.status_code == status.HTTP_200_OK
    assert response.data['detail'] == 'The email was sent again'
