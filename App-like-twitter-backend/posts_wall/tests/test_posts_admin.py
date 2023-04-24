from django.test import RequestFactory
from users.models import User
from django.urls import reverse
from mixer.backend.django import mixer
from django.contrib.admin.sites import AdminSite
from posts_wall.admin import Post, PostsAdmin, Comments, CommentsInline
import pytest


@pytest.mark.django_db
class TestPostsAdmin:
    def setup_method(self):
        self.admin_site = AdminSite()
        self.post_admin = PostsAdmin(Post, self.admin_site)
        self.factory = RequestFactory()
        self.user = User.objects.create_superuser(
            nickname='admin',
            email='admin@example.com',
            password='password'
        )
        self.post = mixer.blend(Post)
        self.comment = mixer.blend(Comments, post=self.post)

    def test_tags_list(self):
        result = self.post_admin.tags_list(self.post)
        assert result == ", ".join([tag.tag for tag in self.post.tags.all()])

    def test_get_inline_instances(self):
        request = self.factory.get(
            reverse('admin:app_list', args=('posts_wall',)))
        request.user = self.user
        inline_instances = self.post_admin.get_inline_instances(request)
        assert isinstance(inline_instances[0], CommentsInline)
