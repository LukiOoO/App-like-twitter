import pytest
from django.contrib.admin.sites import AdminSite
from mixer.backend.django import mixer
from users.admin import AdminUser
from users.models import User


@pytest.fixture
def user_admin():
    return AdminUser(User, AdminSite())


@pytest.fixture
def user():
    return mixer.blend(User)


def test_user_admin_should_have_correct_list_display(user_admin):
    assert user_admin.list_display == [
        'email', 'nickname',
        'is_staff', 'admin', 'is_active', 'avatar', 'freeze_or_not']


def test_user_admin_should_have_correct_list_filter(user_admin):
    assert user_admin.list_filter == ['staff', 'groups']


def test_user_admin_should_have_correct_list_per_page(user_admin):
    assert user_admin.list_per_page == 15


def test_user_admin_should_have_correct_list_editable(user_admin):
    assert user_admin.list_editable == ['is_active', 'freeze_or_not']


def test_user_admin_should_have_correct_ordering(user_admin):
    assert user_admin.ordering == ['email', 'nickname']


def test_user_admin_should_have_correct_search_fields(user_admin):
    assert user_admin.search_fields == [
        'nickname__istartswith', 'email__istartswith']


def test_user_admin_should_have_correct_fieldsets(user_admin):
    expected_fieldsets = (
        (None, {'fields': ('email', 'nickname',  'slug',  'avatar')}),
        ('Permissions', {'fields': ('staff', 'groups')}),
        ('Password', {'fields': ('password',)}),
        ('Followers and following', {'fields': ('followers', 'following')})
    )
    assert user_admin.fieldsets == expected_fieldsets


def test_user_admin_should_have_correct_add_fieldsets(user_admin):
    expected_add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nickname', 'password1',
                       'password2', 'slug',  'is_active', 'staff',
                       'admin', 'groups')}
         ),
    )
    assert user_admin.add_fieldsets == expected_add_fieldsets


def test_user_admin_should_have_correct_search_fields(user_admin):
    assert user_admin.search_fields == ('nickname', 'email')


def test_user_admin_should_have_correct_ordering(user_admin):
    assert user_admin.ordering == ('nickname',)


def test_user_admin_should_have_correct_filter_horizontal(user_admin):
    assert user_admin.filter_horizontal == ('groups', 'followers', 'following')
