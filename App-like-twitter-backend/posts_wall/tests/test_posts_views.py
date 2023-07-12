from django.contrib.auth.models import AnonymousUser
import pytest
from rest_framework import status
from rest_framework.test import force_authenticate
from rest_framework.test import APIClient
import pytest
from rest_framework.test import APIClient
from django.test import RequestFactory
from posts_wall.views import ShowUserPosts
from tags.models import Tags
from posts_wall.models import Post
from users.models import User
from posts_wall.models import Post
from posts_wall.models import Like


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user():
    user = User.objects.create_user(
        nickname='testuser', email='xd@xd.com', password='testpassword', freeze_or_not=False)
    return user


@pytest.fixture
def post(user):
    tag1 = Tags.objects.create(user=user, tag='tag1')
    tag2 = Tags.objects.create(user=user, tag='tag2')
    post = Post.objects.create(user=user, text='Test post')
    post.tags.add(tag1, tag2)
    return post


@pytest.mark.django_db
def test_create_post(api_client, user):
    api_client.force_authenticate(user=user)
    tag1 = Tags.objects.create(user=user, tag='tag1')
    tag2 = Tags.objects.create(user=user, tag='tag2')
    url = '/p_w/user-post-manager/'
    data = {
        'text': 'Test post',
        'user': user.pk,
        'tags': [tag1.tag, tag2.tag]
    }
    response = api_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data['text'] == 'Test post'
    assert len(response.data['tags']) == 2
    assert response.data['tags'] == ['#TAG1', '#TAG2']


@pytest.mark.django_db
def test_list_user_posts(api_client, user):
    tag1 = Tags.objects.create(user=user, tag='tag1')
    tag2 = Tags.objects.create(user=user, tag='tag2')
    post = Post.objects.create(user=user, text='Test post')
    post.tags.add(tag1, tag2)

    api_client.force_authenticate(user=user)
    url = '/p_w/user-post-manager/'
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert 'Your posts' in response.data
    assert len(response.data['Your posts']) == 1
    assert response.data['Your posts'][0]['text'] == 'Test post'


@pytest.mark.django_db
def test_retrieve_user_post(api_client, user, post):
    api_client.force_authenticate(user=user)
    url = f'/p_w/user-post-manager/{post.pk}/'
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.data['Your post']['text'] == 'Test post'


@pytest.mark.django_db
def test_delete_user_post(api_client, user, post):
    api_client.force_authenticate(user=user)
    url = f'/p_w/user-post-manager/{post.pk}/'
    response = api_client.delete(url)
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not Post.objects.filter(pk=post.pk).exists()


@pytest.mark.django_db
def test_update_user_post(api_client, user, post):
    tag3 = Tags.objects.create(user=user, tag='tag3')
    api_client.force_authenticate(user=user)
    url = f'/p_w/user-post-manager/{post.pk}/'
    data = {
        'text': 'Updated post',
        'user': user.pk,
        'tags': [tag3.tag]
    }
    response = api_client.patch(url, data)
    assert response.status_code == status.HTTP_202_ACCEPTED
    assert response.data['text'] == 'Updated post'
    assert response.data['tags'] == ['#TAG3']


@pytest.mark.django_db
def test_list_with_valid_tag_name(client, user):
    url = '/p_w/search-post-by-tags/'
    tag_name = Tags.objects.create(user=user, tag='example_tag')

    post = Post.objects.create(text='xdd', user=user)
    post.tags.add(tag_name)

    response = client.get(url, {'tag_name': tag_name})

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) > 0


@pytest.mark.django_db
def test_list_with_missing_tag_name(client):
    url = '/p_w/search-post-by-tags/'

    response = client.get(url)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'detail' in response.data
    assert response.data['detail'] == 'Tag name is required.'


@pytest.mark.django_db
def test_list_with_invalid_tag_name(client):
    url = '/p_w/search-post-by-tags/'
    tag_name = 'nonexistent_tag'

    response = client.get(url, {'tag_name': tag_name})

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 0


@pytest.fixture
def factory():
    return RequestFactory()


@pytest.fixture
def view():
    return ShowUserPosts.as_view(actions={
        'get': 'list',
        'post': 'post',
    })


@pytest.mark.django_db
def test_show_user_posts_list(factory, view):
    request = factory.get('/show_user_posts/')
    force_authenticate(request, user=User.objects.create(
        nickname='testuser', freeze_or_not=False))
    response = view(request)
    assert response.status_code == status.HTTP_200_OK
    assert response.data == 'No posts'


@pytest.mark.django_db
def test_show_user_posts_post_invalid_post_id(factory, view):
    request = factory.post('/show_user_posts/', {'follow_post': 999})
    force_authenticate(request, user=User.objects.create(
        nickname='testuser', freeze_or_not=False))
    response = view(request)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data == {'error': 'Invalid post ID'}


@pytest.mark.django_db
def test_show_user_posts_list_anonymous_user(factory, view):
    request = factory.get('/show_user_posts/')
    request.user = AnonymousUser()
    response = view(request)
    assert response.status_code == status.HTTP_200_OK
    assert response.data == "No posts"


@pytest.mark.django_db
def test_show_user_posts_post_already_followed(factory, view):
    user = User.objects.create(nickname='testuser', freeze_or_not=False)
    post = Post.objects.create(text='xdd', user=user)
    like = Like.objects.create(posts=post, user=user)
    request = factory.post('/show_user_posts/', {'follow_post': post.pk})
    force_authenticate(request, user=user)

    request.user = user

    response = view(request)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data == {'error': 'You have already followed this post'}


@pytest.mark.django_db
def test_show_user_posts_post_exception(factory, view):
    request = factory.post('/show_user_posts/')
    user = User.objects.create(
        nickname='testuser', freeze_or_not=True)
    response = view(request)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
