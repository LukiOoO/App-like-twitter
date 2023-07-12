from django.conf import settings
from mixer.backend.django import mixer
import pytest
from users.models import User
from tags.models import Tags
from posts_wall.models import Post, Like
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


@pytest.fixture
def user():
    return User.objects.create(nickname='testuser')


@pytest.fixture
def post(user):
    return Post.objects.create(text='Test Post', user=user)


@pytest.mark.django_db
def test_like_model(post, user):
    like = Like.objects.create(posts=post, user=user)
    assert like.posts == post
    assert like.user == user
