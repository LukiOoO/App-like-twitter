from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate
import pytest
from posts_wall.models import Post
from users.serializers import UserSerializer
from users.views import ResetPassword, FollowersAndFollowingBaseView, UserPosts, SearchUserProfile, FollowAndUnFollowUserView
from users.views import MyUserViewSet
from users.models import User


@pytest.mark.django_db
def test_reset_password():
    factory = APIRequestFactory()
    view = ResetPassword.as_view()
    user = User.objects.create_user(
        nickname='testuser', email='test1email@ok.com', freeze_or_not=False, password='testpass')
    data = {
        'current_password': 'testpass',
        'new_password': 'newpass',
    }
    request = factory.post('/reset_password/1/token123/', data)
    force_authenticate(request, user=user)

    response = view(request, uid='1', token='token123')
    assert response.status_code == status.HTTP_200_OK
    assert response.data == 'Password changed successfully.'


@pytest.mark.django_db
def test_reset_password_invalid_current_password():
    factory = APIRequestFactory()
    view = ResetPassword.as_view()
    user = User.objects.create_user(
        nickname='testuser', email='test2email@ok.com', freeze_or_not=False, password='testpass')
    data = {
        'current_password': 'wrongpass',
        'new_password': 'newpass',
    }
    request = factory.post('/reset_password/1/token123/', data)
    force_authenticate(request, user=user)

    response = view(request, uid='1', token='token123')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data == 'Invalid current password.'


@pytest.mark.django_db
def test_reset_password_exception():
    factory = APIRequestFactory()
    view = ResetPassword.as_view()

    user = User.objects.create_user(
        nickname='testuser', email='test3email@ok.com', freeze_or_not=False, password='testpass')
    current_password = 'testpass'
    new_password = ''

    request = factory.post(f'/reset_password/{user.id}/token123/', {
        'current_password': current_password,
        'new_password': new_password,
    })

    force_authenticate(request, user=user)

    response = view(request, uid='1', token='token123')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'The field must be filled in'


@pytest.mark.django_db
class TestMyUserViewSet:
    def setup_method(self, method):
        self.factory = APIRequestFactory()
        self.view = MyUserViewSet.as_view({'get': 'me', 'put': 'me'})
        self.user = User.objects.create_user(
            nickname='testuser', email='test@test.com', password='testpassword', freeze_or_not=False)

    def test_get_me(self):
        request = self.factory.get('/users/me/')
        force_authenticate(request, user=self.user)

        response = self.view(request)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['nickname'] == 'testuser'
        assert response.data['email'] == 'test@test.com'

    def test_put_me_valid_data(self):
        data = {'nickname': 'newuser', 'email': 'new@test.com'}
        request = self.factory.put('/users/me/', data=data)
        force_authenticate(request, user=self.user)

        response = self.view(request)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['nickname'] == 'newuser'
        assert response.data['email'] == 'new@test.com'

    def test_put_me_invalid_data(self):
        data = {'nickname': ''}
        request = self.factory.put('/users/me/', data=data)
        force_authenticate(request, user=self.user)

        response = self.view(request)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_exception_handling(self):
        request = self.factory.get('/users/me/')
        response = self.view(request)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "Authentication credentials were not provided." in response.data['detail']


class DummyFollowersAndFollowingView(FollowersAndFollowingBaseView):
    def get_queryset(self):
        return User.objects.all()

    def get_serializer_class(self):
        return UserSerializer

    def get_response_data(self, data):
        return data


@pytest.mark.django_db
def test_get_follow_unfollow():
    view = FollowAndUnFollowUserView()

    user = User.objects.create(
        nickname='user1', email='xsasd@asdz.com', freeze_or_not=False)
    user_to_follow = User.objects.create(
        nickname='user2', email='xzd@dla.com', freeze_or_not=False)

    request_data = {
        'user_id': user_to_follow.id,
    }
    request = type('Request', (), {'user': user, 'data': request_data})

    response = view.get_follow_unfollow(
        request, 'user_id', 'Message1', 'Message2', 'Message3', 1)

    assert response.status_code == status.HTTP_200_OK
    assert response.data == {'message': 'Message3'}

    assert user_to_follow in user.following.all()

    response = view.get_follow_unfollow(
        request, 'user_id', 'Message1', 'Message2', 'Message3', 2)

    assert response.status_code == status.HTTP_200_OK
    assert response.data == {'message': 'Message3'}

    assert user_to_follow not in user.following.all()

    request_data['user_id'] = 123
    response = view.get_follow_unfollow(
        request, 'user_id', 'Message1', 'Message2', 'Message3', 1)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data == {'error': 'Invalid user ID'}

    request_data['user_id'] = user.id
    response = view.get_follow_unfollow(
        request, 'user_id', 'Message1', 'Message2', 'Message3', 1)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data == {'error': 'Message1'}


factory = APIRequestFactory()


@pytest.mark.django_db
def test_search_user_profile():
    view = SearchUserProfile.as_view({'get': 'list'})

    user = User.objects.create_user(
        password='testpassword', nickname='testnickname', email='xzd@xzckl.com',  freeze_or_not=False)

    url = '/search-user-profile/'
    request = factory.get(url, {'user_name': 'testnickname'})
    force_authenticate(request, user=user)
    response = view(request)

    assert response.status_code == status.HTTP_200_OK
    assert 'detail' not in response.data
    assert response.data['nickname'] == 'testnickname'


@pytest.mark.django_db
def test_user_posts():
    view = UserPosts.as_view({'get': 'list'})

    user = User.objects.create_user(
        password='testpassword', nickname='testnickname', email='xzd@xzckl.com', freeze_or_not=False)
    post1 = Post.objects.create(user=user, text='Test post 1')
    post2 = Post.objects.create(user=user, text='Test post 2')

    url = '/search-user-posts/'
    request = factory.get(url, {'user_name': 'testnickname'})
    force_authenticate(request, user=user)
    response = view(request)

    assert response.status_code == status.HTTP_200_OK
    assert 'detail' not in response.data
    assert len(response.data) == 2
    assert response.data[0]['text'] == 'Test post 1'
    assert response.data[1]['text'] == 'Test post 2'
