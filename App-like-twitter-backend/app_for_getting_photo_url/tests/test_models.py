import pytest
import os
from django.core.files.uploadedfile import SimpleUploadedFile
from app_for_getting_photo_url.models import AppContentByProgrammer, StaticStorage
from django.conf import settings


@pytest.fixture
def static_storage():
    return StaticStorage()


@pytest.fixture
def app_content():
    file = SimpleUploadedFile('test.txt', b'test file content')
    return AppContentByProgrammer.objects.create(
        name='Test AppContent',
        file_field=file
    )


@pytest.mark.django_db
def test_static_storage(static_storage):
    assert static_storage.base_url == settings.STATIC_URL
    assert static_storage.location == os.path.abspath(settings.STATIC_ROOT)


@pytest.mark.django_db
def test_app_content_file_field(app_content):
    expected_file_name = os.path.basename(app_content.file_field.name)
    expected_file_path = os.path.join(
        'app_for_getting_photo_url', 'app_content', expected_file_name)
    assert str(app_content.file_field) == expected_file_path.replace('\\', '/')
    assert app_content.file_field.read() == b'test file content'
    app_content.file_field.close()
    os.remove(app_content.file_field.path)
    app_content.delete()
