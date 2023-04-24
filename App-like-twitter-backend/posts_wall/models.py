from django.db import models
from django.conf import settings
from tags.models import Tags
from django.utils.html import format_html
# Create your models here.


class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    text = models.CharField(max_length=280)
    image = models.ImageField(upload_to='post_images', blank=True, null=True)
    video = models.FileField(upload_to='post_videos', blank=True, null=True)
    gif = models.FileField(upload_to='post_gif', blank=True, null=True)
    tags = models.ManyToManyField(Tags)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.text
