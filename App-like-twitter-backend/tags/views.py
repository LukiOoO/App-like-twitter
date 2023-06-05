from rest_framework import viewsets
from .models import Tags
from users.permissions import IsProfileOwner
from .serializers import UserTagsListSerializer, UsersTagsListSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsProfileOwner

# Create your views here.


class UserTagsListView(viewsets.ModelViewSet):
    queryset = Tags.objects.all()
    serializer_class = UserTagsListSerializer
    permission_classes = [IsAuthenticated, IsProfileOwner]

    def list(self, request, *args, **kwargs):
        if request.user.freeze_or_not:
            return Response(data={'message': 'Your account is frozen'},
                            status=status.HTTP_400_BAD_REQUEST)

        user_tags = Tags.objects.filter(user=self.request.user)
        seriazlier = self.get_serializer(user_tags, many=True)

        if not seriazlier.data:
            return Response("You haven't created any tags ")
        return Response({'Your tags': seriazlier.data})

    def create(self, request, *args, **kwargs):

        if request.user.freeze_or_not:
            return Response(data={'message': 'Your account is frozen'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(user=request.user)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response("this tag already exists ", status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        if request.user.freeze_or_not:
            return Response(data={'message': 'Your account is frozen'},
                            status=status.HTTP_400_BAD_REQUEST)

        tag_id = kwargs['pk']
        tag = Tags.objects.filter(id=tag_id, user=request.user).first()

        if not tag:
            return Response("Tag not found", status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(tag)
        return Response({'Your tag': serializer.data})

    def destroy(self, request, *args, **kwargs):
        if request.user.freeze_or_not:
            return Response(data={'message': 'Your account is frozen'},
                            status=status.HTTP_400_BAD_REQUEST)
        tag_id = kwargs['pk']
        tag = Tags.objects.filter(id=tag_id, user=request.user).first()

        if not tag:
            return Response("Tag not found", status=status.HTTP_404_NOT_FOUND)

        tag.delete()
        return Response("Tag deleted successfully", status=status.HTTP_204_NO_CONTENT)


class GetAllUsersTagsView(viewsets.ReadOnlyModelViewSet):
    queryset = Tags.objects.all()
    serializer_class = UsersTagsListSerializer
