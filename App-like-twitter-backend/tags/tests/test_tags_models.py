from django.contrib.auth import get_user_model
from django.db.utils import IntegrityError
import pytest
from tags.models import Tags


@pytest.mark.django_db
def test_create_tag():
    User = get_user_model()
    user = User.objects.create_user(
        nickname='testuser', email='test@example.com', password='top_secret')

    tag = Tags(user=user, tag='#test_tag')
    tag.save()

    assert Tags.objects.count() == 1
    assert Tags.objects.first().user == user
    assert Tags.objects.first().tag == '#TEST_TAG'


@pytest.mark.django_db
def test_create_tag_without_user():
    with pytest.raises(IntegrityError):
        Tags.objects.create(tag='#test_tag')
