import pytest
from django.contrib import admin
from tags.models import Tags
from tags.admin import TagsAdmin, TagsAdminForm
from users.models import User


@pytest.mark.django_db
def test_tags_admin():
    model_admin = admin.site._registry[Tags]
    assert isinstance(model_admin, TagsAdmin)

    assert model_admin.content
    assert model_admin.list_display == ['user', 'tag']
    assert model_admin.list_per_page == 15
    assert model_admin.search_fields == ['user', 'tag']
    assert model_admin.form == TagsAdminForm


@pytest.mark.django_db
def test_clean_tag_valid():
    user = User.objects.create(nickname='testuser')
    form_data = {'user': user.id, 'tag': '#valid_tag'}
    form = TagsAdminForm(data=form_data)

    assert form.is_valid()
    assert form.cleaned_data['tag'] == '#valid_tag'


@pytest.mark.django_db
def test_clean_tag_invalid():
    user = User.objects.create(nickname='testuser')
    Tags.objects.create(tag='#existing_tag', user_id=user.id)
    form_data = {'tag': 'existing_tag'}
    form = TagsAdminForm(data=form_data)

    assert not form.is_valid()
    assert 'Tag with this name already exists.' in form.errors['tag']
