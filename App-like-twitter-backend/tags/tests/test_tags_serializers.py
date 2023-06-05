import pytest
from users.models import User
from tags.models import Tags
from tags.serializers import UsersTagsListSerializer, UserTagsListSerializer


@pytest.mark.django_db
def test_users_tags_list_serializer():
    user = User.objects.create(nickname='test_user')

    tag = Tags.objects.create(tag='test_tag', user=user)

    serializer = UsersTagsListSerializer(instance=tag)

    serialized_data = serializer.data
    assert 'tag' in serialized_data
    assert serialized_data['tag'] == '#TEST_TAG'


@pytest.mark.django_db
def test_user_tags_list_serializer():
    user = User.objects.create(nickname='test_user')

    tag = Tags.objects.create(tag='test_tag', user=user)

    serializer = UserTagsListSerializer(instance=tag)

    serialized_data = serializer.data
    assert 'tag_id' in serialized_data
    assert 'tag' in serialized_data
    assert serialized_data['tag_id'] == tag.id
    assert serialized_data['tag'] == '#TEST_TAG'
