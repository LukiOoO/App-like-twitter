import pytest
from mixer.backend.django import mixer
from django.conf import settings
from tags.models import Tags
from posts_wall.models import Post


@pytest.mark.django_db
class TestPostModel:
    def test_post_str(self):
        post = mixer.blend(Post, text='Test post')
        assert str(post) == 'Test post'

    def test_post_created(self):
        user = mixer.blend(settings.AUTH_USER_MODEL)
        tag1 = mixer.blend(Tags)
        tag2 = mixer.blend(Tags)
        post = Post.objects.create(
            user=user,
            text='Test post',
        )
        post.tags.add(tag1, tag2)
        assert Post.objects.count() == 1
        assert post in Post.objects.all()
        assert tag1 in post.tags.all()
        assert tag2 in post.tags.all()
