from django.db import models
import os
from django.conf import settings
from django.core.files.storage import FileSystemStorage


class StaticStorage(FileSystemStorage):
    def __init__(self, *args, **kwargs):
        super().__init__(location=settings.STATIC_ROOT, base_url=settings.STATIC_URL)

    def _save(self, name, content):
        if os.path.dirname(name):
            os.makedirs(os.path.dirname(self.path(name)), exist_ok=True)
        return super()._save(name, content)


class AppContentByProgrammer(models.Model):
    name = models.CharField(max_length=255)
    file_field = models.FileField(
        upload_to='app_for_getting_photo_url/app_content', storage=StaticStorage(), null=True)

    created_at = models.DateTimeField(auto_now_add=True)
