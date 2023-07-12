import pytest
from users.models import User
from posts_wall.models import Post
from comments.models import Comments


@pytest.mark.django_db
def test_comment_creation():
    user = User.objects.create_user(
        nickname='testuser', password='testpass', email='test@test.com')
    post = Post.objects.create(user_id=user.id, text='test post')
    comment = Comments.objects.create(
        post=post, user=user, text='test comment')
    assert isinstance(comment, Comments)
    assert comment.post == post
    assert comment.user == user
    assert comment.text == 'test comment'
    assert comment.image == None
    assert comment.video == None
    assert comment.gif == None
    assert comment.created_at is not None
