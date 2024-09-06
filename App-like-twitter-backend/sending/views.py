from rest_framework.exceptions import NotFound
from django.contrib.auth.tokens import default_token_generator
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import logging
from celery import shared_task
from users.models import User
from .serializers import ResendActivationSerializer
from users.permissions import IsProfileOwner

logging.getLogger(__name__)


@shared_task
def send_activation_email(user_id):
    user = User.objects.get(id=user_id)

    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    activation_url = settings.BASE_URL + f"/s/activate/{uid}/{token}"
    activation_link = activation_url

    message = f"""
                <html>
                <head>
                </head>
                <body>
                    <div class="message">
                        Hello <span class="nickname">{user.nickname}</span>,
                        <br><br>
                        activate your account, click on the link below:
                        <br>
                        <a class="activation-link" href="{activation_link}">{activation_link}</a>
                    </div>
                </body>
                </html>
                """
    email = EmailMultiAlternatives(
        subject='Account activation',
        body=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    email.attach_alternative(message, "text/html")
    email.send()


class ActivationView(APIView):
    permission_classes = [IsProfileOwner, IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
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
        except Exception as e:
            return Response(str(e), status=status.HTTP_403_FORBIDDEN)


class ResendActivationView(APIView):
    serializer_class = ResendActivationSerializer

    @shared_task
    def resend_activation_email(user_id):
        user = User.objects.get(id=user_id)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        activation_url = settings.BASE_URL + f"/s/activate/{uid}/{token}"
        activation_link = activation_url
        message = f"""
                <html>
                <head>
                </head>
                <body>
                    <div class="message">
                        Hello <span class="nickname">{user.nickname}</span>,
                        <br><br>
                        Re-activate your account, click on the link below:
                        <br>
                        <a class="activation-link" href="{activation_link}">{activation_link}</a>
                    </div>
                </body>
                </html>
                """
        email = EmailMultiAlternatives(
            subject='Account re-activation',
            body=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
        )
        print(f'The email was sent to {user.nickname}')
        email.attach_alternative(message, "text/html")
        email.send()

    def post(self, request):
        try:
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
                    self.resend_activation_email.delay(user_id=user.id)
                    return Response({'detail': 'The email was sent again'}, status=status.HTTP_200_OK)
                else:
                    return Response({'detail': 'Your account is not frozen.'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status=status.HTTP_403_FORBIDDEN)
