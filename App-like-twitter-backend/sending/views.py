from rest_framework.exceptions import NotFound
from django.contrib.auth.tokens import default_token_generator
from users.models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import ResendActivationSerializer
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from rest_framework import status

# Create your views here.


def send_activation_email(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    activation_url = settings.BASE_URL + f"/s/activate/{uid}/{token}"
    activation_link = activation_url

    message = f"Hello {user.nickname},<br><br>To activate your account, click on the link below:<br><a href='{activation_link}'>{activation_link}</a>"
    email = EmailMultiAlternatives(
        subject='Account activation',
        body=message,
        from_email=settings.DEFAULT_FROM_EMAIL,

        to=[user.email],
    )
    email.attach_alternative(message, "text/html")
    email.send()


class ActivationView(APIView):
    def get(self, request, *args, **kwargs):
        uid = kwargs.get('uid')
        token = kwargs.get('token')
        user_id = request.user.id
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            raise NotFound('User not found')

        if default_token_generator.check_token(user, token):
            user.freeze_or_not = False
            user.save()
            return Response({'message': "Account activated"}, status=status.HTTP_200_OK)
        else:
            return Response({'message': "Invalid token"}, status=status.HTTP_404_NOT_FOUND)


class ResendActivationView(APIView):
    serializer_class = ResendActivationSerializer

    def resend_activation_email(self, user):
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        activation_url = settings.BASE_URL + f"/s/activate/{uid}/{token}"
        activation_link = activation_url

        message = f"Hello {user.nickname},<br><br>Re-activate your account, click on the link below:<br><a href='{activation_link}'>{activation_link}</a>"
        email = EmailMultiAlternatives(
            subject='Account re-activation',
            body=message,
            from_email=settings.DEFAULT_FROM_EMAIL,

            to=[user.email],
        )
        email.attach_alternative(message, "text/html")
        email.send()

    def post(self, request):
        serializer = ResendActivationSerializer(data=request.data)
        if request.user.is_anonymous:
            raise NotFound()
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({'detail': 'User with this email does not exist'})

            if user.freeze_or_not:
                self.resend_activation_email(user)
                return Response({'detail': 'The email was sent again'}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Your account is not frozen.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
