from django.db import models
from django.conf import settings


class Tags(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    tag = models.CharField(max_length=255, unique=True)

    def save(self, *args, **kwargs):
        if not self.tag.startswith('#'):
            self.tag = '#' + self.tag
        self.tag = self.tag.upper()

        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.tag
