from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework.viewsets import GenericViewSet
from users.models import User
from rest_framework.response import Response
from rest_framework.decorators import action, permission_classes
from django.http import Http404
from .models import User
from .serializers import UserSerializer, ResetPasswordSerializer
from .permissions import IsProfileOwner
from rest_framework.exceptions import NotFound
from rest_framework import status
from rest_framework.views import APIView

# Create your views here.


class MyUserViewSet(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsProfileOwner]

    @action(detail=False, methods=['GET', 'PUT'])
    def me(self, request):

        if permission_classes:
            if request.user.is_anonymous:
                raise NotFound()
            elif request.user.freeze_or_not:
                return Response(data={'message': 'Your account is frozen'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                user = User.objects.get(id=request.user.id)
            except User.DoesNotExist:
                raise Http404
            if request.method == 'GET':
                serializer = UserSerializer(user)
                return Response(serializer.data)
            elif request.method == 'PUT':
                serializer = UserSerializer(user, data=request.data)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data)


class ResetPassword(APIView):
    serializer_class = ResetPasswordSerializer
    permission_classes = [IsProfileOwner]

    def post(self, request,  uid, token):

        if request.user.is_anonymous:
            raise NotFound()

        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        user = request.user

        if not user.check_password(current_password):
            return Response("Invalid current password.", status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save()

        return Response("Password changed successfully.", status=status.HTTP_200_OK)
