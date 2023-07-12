from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework.test import APIRequestFactory, force_authenticate
from rest_framework import status
from rest_framework.exceptions import PermissionDenied as DRFPermissionDenied
import pytest
from users.models import User
from tags.models import Tags
from tags.serializers import UsersTagsListSerializer, UserTagsListSerializer
from tags.views import UserTagsListView
from users.permissions import FreezeAccountPermission


@pytest.mark.django_db
def test_get_all_users_tags_view():
    user = User.objects.create(nickname='test_user')

    tag = Tags.objects.create(tag='#TAG1', user=user)

    serializer = UsersTagsListSerializer([tag], many=True)

    serialized_data = serializer.data

    assert 'tag' in serialized_data[0]


@pytest.mark.django_db
def test_list_with_no_tags():
    factory = APIRequestFactory()
    user = User.objects.create_user(
        nickname='testuser', email='test@test.com', password='testpassword')
    user.freeze_or_not = False
    request = factory.get('/user-tags-list/')
    request.user = user

    view = UserTagsListView.as_view({'get': 'list'})
    force_authenticate(request, user=user)

    response = view(request)

    assert response.status_code == status.HTTP_200_OK
    assert response.data == "You haven't created any tags "


@pytest.mark.django_db
def test_list_with_tags():
    factory = APIRequestFactory()
    user = User.objects.create_user(
        nickname='testuser', email='test@test.com', password='testpassword')
    user.freeze_or_not = False
    tags = Tags.objects.create(user=user)
    request = factory.get('/user-tags-list/')
    request.user = user

    view = UserTagsListView.as_view({'get': 'list'})
    force_authenticate(request, user=user)

    response = view(request)

    assert response.status_code == status.HTTP_200_OK
    assert response.data == {'Your tags': [UserTagsListSerializer(tags).data]}


@pytest.mark.django_db
def test_create_existing_user_tag():
    client = APIClient()

    user = User.objects.create(nickname='testuser', freeze_or_not=False)
    client.force_authenticate(user=user)

    Tags.objects.create(tag='existing_tag', user=user)

    data = {'tag': 'existing_tag', 'user': user.id}

    response = client.post(reverse('user-tags-list'), data, format='json')

    assert response.status_code == status.HTTP_400_BAD_REQUEST

    assert response.data == 'this tag already exists'


@pytest.mark.django_db
class TestUserTagsListView:
    def test_retrieve_with_frozen_account(self):
        factory = APIRequestFactory()
        view = UserTagsListView.as_view({'get': 'retrieve'})
        user = User.objects.create_user(
            nickname='testuser', email='test@test.com', password='testpassword')
        permission = FreezeAccountPermission()

        user.freeze_or_not = True
        user.save()
        request = factory.get('/tags/1/')
        request.user = user
        force_authenticate(request, user=user)
        response = view(request, pk=1)

        with pytest.raises(DRFPermissionDenied) as exc_info:
            permission.has_permission(request, None)
        assert str(exc_info.value) == 'Your account is frozen'

    def test_retrieve_with_valid_tag_id(self):
        factory = APIRequestFactory()
        view = UserTagsListView.as_view({'get': 'retrieve'})
        user = User.objects.create_user(
            nickname='testuser', email='test@test.com', password='testpassword')
        user.freeze_or_not = False
        user.save()
        tag = Tags.objects.create(user=user, tag='Test Tag')
        request = factory.get('/tags/1/')
        request.user = user
        force_authenticate(request, user=user)
        response = view(request, pk=tag.id)

        assert response.status_code == status.HTTP_200_OK
        assert response.data == {'Your tag': {
            'tag_id': tag.id, 'tag': '#TEST TAG'}}

    def test_retrieve_with_invalid_tag_id(self):
        factory = APIRequestFactory()
        view = UserTagsListView.as_view({'get': 'retrieve'})
        user = User.objects.create_user(
            nickname='testuser', email='test@test.com', password='testpassword')
        user.freeze_or_not = False
        user.save()
        request = factory.get('/tags/1/')
        request.user = user
        force_authenticate(request, user=user)

        response = view(request, pk=1)

        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data == 'Tag not found'


@pytest.fixture
def user_factory():
    def create_user(nickname):
        return User.objects.create(nickname=nickname)
    return create_user


@pytest.fixture
def api_client():
    return APIRequestFactory()


@pytest.mark.django_db
def test_destroy_tag(api_client, user_factory):
    user = user_factory('test_user')
    permission = FreezeAccountPermission()

    tag_id = 1
    tag = Tags.objects.create(id=tag_id, user=user)
    view = UserTagsListView.as_view({'delete': 'destroy'})

    user.freeze_or_not = True
    user.save()

    request = api_client.delete('/tags/{}/'.format(tag_id))
    force_authenticate(request, user=user)
    response = view(request, pk=tag_id)

    with pytest.raises(DRFPermissionDenied) as exc_info:
        permission.has_permission(request, None)
    assert str(exc_info.value) == 'Your account is frozen'
    user.freeze_or_not = False
    user.save()

    request = api_client.delete('/tags/{}/'.format(tag_id))
    force_authenticate(request, user=user)
    response = view(request, pk=tag_id)

    assert response.data == 'Tag deleted successfully'
