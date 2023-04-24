from django.db import models
from django.conf import settings
from posts_wall.models import Post
# Create your models here.


class Comments(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    text = models.CharField(max_length=280)
    image = models.ImageField(
        upload_to='comments_images', blank=True, null=True)
    video = models.FileField(
        upload_to='comments_videos', blank=True, null=True)
    gif = models.FileField(upload_to='comments_gif', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
