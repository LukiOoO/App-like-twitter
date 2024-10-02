from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, status
from users.permissions import FreezeAccountPermission
from posts_wall.permissions import IsProfileOwnerPostMg
from users.permissions import IsAnonymousUser
from rest_framework.response import Response
import logging
from .models import Comments
from .serializers import CommentsSerializer, ShowUserCommentsSerializer
from rest_framework.exceptions import ValidationError


logging.getLogger(__name__)

class PostCommentsViews(viewsets.ModelViewSet):
    serializer_class = CommentsSerializer

    def get_queryset(self):
        post_id = self.kwargs['show_user_posts_pk']
        return Comments.objects.filter(post_id=post_id)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({
            'post_id': self.kwargs['show_user_posts_pk'],
            'user_id': self.request.user.id,
        })
        return context

    def get_permissions(self):
        if self.action == 'list':
            return [IsAnonymousUser()]
        return [IsAuthenticated(), IsProfileOwnerPostMg(), FreezeAccountPermission()]

class ShowUserComments(viewsets.ReadOnlyModelViewSet):
    queryset = Comments.objects.all()
    serializer_class = ShowUserCommentsSerializer
    permission_classes = [IsAuthenticated,
                          IsProfileOwnerPostMg, FreezeAccountPermission]
    
    def get_queryset(self):
        user_nickname = self.request.query_params.get('user_nickname')
        if not user_nickname:
            raise ValidationError({"detail": "User name is required"}, code=status.HTTP_400_BAD_REQUEST)        
        return Comments.objects.filter(user__nickname=user_nickname)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({"detail": "You haven't created any comments"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(queryset, many=True)
        return Response({'User comments': serializer.data}, status=status.HTTP_200_OK)