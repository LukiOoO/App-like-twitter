import pytest
from users.models import User
from comments.serializers import CommentsSerializer
from posts_wall.models import Post


@pytest.mark.django_db
def test_comments_serializer_create():
    user = User.objects.create(nickname='testuser')

    user_id = user.id
    post = Post.objects.create(text='Test post', user=user)
    post_id = post.id
    serializer = CommentsSerializer(
        context={'post_id': post_id, 'user_id': user_id})
    data = {
        'text': 'Test comment',
        'image': 'test.jpg',
        'video': 'test.mp4',
        'gif': 'test.gif'
    }

    comment = serializer.create(validated_data=data)

    assert comment.post_id == post_id
    assert comment.user_id == user_id
    assert comment.text == data['text']
    assert comment.image == data['image']
    assert comment.video == data['video']
    assert comment.gif == data['gif']
