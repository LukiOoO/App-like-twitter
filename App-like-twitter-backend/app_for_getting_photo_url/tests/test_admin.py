import pytest
from django.contrib.admin.sites import AdminSite
from app_for_getting_photo_url.admin import AppContentByProgrammerAdmin
from app_for_getting_photo_url.models import AppContentByProgrammer


@pytest.fixture
def app_content_admin():
    return AppContentByProgrammerAdmin(AppContentByProgrammer, AdminSite())


def test_app_content_by_programmer_admin_list_display(app_content_admin):
    assert 'name' in app_content_admin.list_display
    assert 'created_at' in app_content_admin.list_display


def test_app_content_by_programmer_admin_list_per_page(app_content_admin):
    assert app_content_admin.list_per_page == 15
