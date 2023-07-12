import pytest
from sending.serializers import ResendActivationSerializer


@pytest.mark.django_db
def test_resend_activation_serializer():
    email = 'test@example.com'
    data = {'email': email}

    serializer = ResendActivationSerializer(data=data)
    assert serializer.is_valid()

    validated_data = serializer.validated_data
    assert validated_data['email'] == email
