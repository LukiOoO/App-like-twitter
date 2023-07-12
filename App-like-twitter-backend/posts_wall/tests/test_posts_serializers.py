from rest_framework import serializers
import pytest
from django.utils import timezone
from users.models import User
from tags.models import Tags
from posts_wall.serializers import UserpPostManagerSerializer, SearchPostByTagsSerializer
from posts_wall.models import Post, Like
from posts_wall.serializers import validate_tags
from posts_wall.serializers import ShowUserPostsSerializer


def test_validate_tags():
    with pytest.raises(serializers.ValidationError) as exc_info:
        validate_tags(value='')
    assert str(
        exc_info.value) == "[ErrorDetail(string='At least one tag is required.', code='invalid')]"

    tags = ['#AG1', '#XSD2']
    assert validate_tags(tags) == tags


@pytest.fixture
def sample_post():
    user = User.objects.create(nickname='testuser')
    tags = Tags.objects.create(user=user, tag='tag1')
    post = Post.objects.create(
        text='Test post',
        image='test.jpg',
        video='test.mp4',
        gif='test.gif',
        created_at=timezone.now(),
        user=user,
    )
    post.tags.add(tags)
    Like.objects.create(user=user, posts=post)
    return post


@pytest.fixture
def serializer_context():
    return {'request': None}


@pytest.mark.django_db
def test_user_post_manager_serializer(sample_post, serializer_context):
    serializer = UserpPostManagerSerializer(
        instance=sample_post,
        context=serializer_context
    )

    expected_fields = ["text", "tags", "created_at", 'post_id', 'likes']
    for field in expected_fields:
        assert field in serializer.data

    assert serializer.data['text'] == sample_post.text
    assert serializer.data['tags'] == ['#TAG1']
    expected_created_at = sample_post.created_at.strftime('%Y-%m-%d %H:%M:%S')
    assert serializer.data['created_at'] == expected_created_at
    assert serializer.data['post_id'] == sample_post.id
    assert serializer.data['likes'] == 1


@pytest.mark.django_db
def test_user_post_manager_serializer_validation(serializer_context):
    serializer = UserpPostManagerSerializer(context=serializer_context)

    attrs = {
        'text': 'Test post',
        'image': 'test.jpg',
        'video': 'test.mp4',
        'gif': 'test.gif',
        'tags': ['tag1'],
    }
    validated_attrs = serializer.validate(attrs)

    assert validated_attrs == attrs


@pytest.mark.django_db
def test_ShowUserPostsSerializer():
    user = User.objects.create(nickname='TestUser', email='xd123@x.com')
    another_user = User.objects.create(
        nickname='AnotherUser', email='xd123@xdd.com')

    post = Post.objects.create(user=user, text='Testpost')

    Like.objects.create(user=user, posts=post)
    Like.objects.create(user=another_user, posts=post)

    serializer = ShowUserPostsSerializer(post)

    assert serializer.data['user'] == 'TestUser'
    assert serializer.data['post_id'] == post.id
    assert serializer.data['likes']['count'] == 2
    assert 'TestUser' in serializer.data['likes']['liked_by']
    assert 'AnotherUser' in serializer.data['likes']['liked_by']

    assert 'text' in serializer.data
    assert 'image' in serializer.data
    assert 'video' in serializer.data
    assert 'gif' in serializer.data
    assert 'tags' in serializer.data
    assert 'created_at' in serializer.data
    assert 'likes' in serializer.data

    assert 'follow_post' not in serializer.data


@pytest.mark.django_db
def test_search_post_by_tags_serializer():
    user = User.objects.create(nickname='testuser')
    tag1 = Tags.objects.create(tag='tag1', user=user)
    tag2 = Tags.objects.create(tag='tag2', user=user)
    post = Post.objects.create(user=user)
    post.tags.add(tag1, tag2)
    Like.objects.create(user=user, posts=post)

    serializer = SearchPostByTagsSerializer(post)

    assert serializer.data['user'] == 'testuser'
    assert serializer.data['likes']['count'] == 1
    assert 'testuser' in serializer.data['likes']['liked_by']
    assert tag1.tag in serializer.data['tags']
    assert tag2.tag in serializer.data['tags']
