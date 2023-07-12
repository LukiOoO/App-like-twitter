from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from users.permissions import FreezeAccountPermission
from posts_wall.permissions import IsProfileOwnerPostMg
from users.permissions import IsAnonymousUser
import logging
from .models import Comments
from .serializers import CommentsSerializer
# Create your views here.
logging.getLogger(__name__)


class PostCommentsViews(viewsets.ModelViewSet):
    serializer_class = CommentsSerializer

    def get_queryset(self):
        post_id = self.kwargs['show_user_posts_pk']
        return Comments.objects.filter(post_id=post_id)

    def get_serializer_context(self):
        return {'post_id': self.kwargs['show_user_posts_pk'], 'user_id': self.request.user.id}

    def get_permissions(self):
        if self.action == 'list':
            return [IsAnonymousUser()]
        return [IsAuthenticated(), IsProfileOwnerPostMg(), FreezeAccountPermission()]
