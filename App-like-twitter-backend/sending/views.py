from rest_framework.permissions import AllowAny
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
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode

import logging
from celery import shared_task
from users.models import User
from .serializers import ResendActivationSerializer

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
    permission_classes = []  # Nie wymagamy autoryzacji

    def get(self, request, *args, **kwargs):
        try:
            uidb64 = kwargs.get('uid')
            token = kwargs.get('token')

            try:
                uid = force_str(urlsafe_base64_decode(uidb64))
                user = User.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                raise NotFound('User not found')

            if default_token_generator.check_token(user, token):
                user.freeze_or_not = False
                user.save()
                return Response({'message': "Account activated"}, status=status.HTTP_200_OK)
            else:
                return Response({'message': "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)


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


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"detail": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(status=status.HTTP_204_NO_CONTENT)
        send_password_reset_email.delay(user.id)
        return Response(status=status.HTTP_204_NO_CONTENT)


@shared_task
def send_password_reset_email(user_id):
    user = User.objects.get(id=user_id)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    reset_link = f"{settings.FRONTEND_URL.rstrip('/')}/reset-password/{uid}/{token}"
    subject = "Password Reset Request"
    html_body = f"""
    <p>Hello {user.get_username() or user.email},</p>
    <p>You have requested to reset your password.</p>
    <p>Click <a target="_blank" href="{reset_link}">this link</a> to reset your password.</p>
    <p>If you did not request this, you can safely ignore this email.</p>
    """
    email = EmailMultiAlternatives(
        subject=subject,
        body=html_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    email.send()
