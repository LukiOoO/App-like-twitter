# Generated by Django 4.2 on 2023-04-22 12:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0005_alter_comments_gif_alter_comments_image_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comments',
            name='gif',
            field=models.FileField(blank=True, null=True, upload_to='comments_gif'),
        ),
        migrations.AlterField(
            model_name='comments',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='comments_images'),
        ),
        migrations.AlterField(
            model_name='comments',
            name='video',
            field=models.FileField(blank=True, null=True, upload_to='comments_videos'),
        ),
    ]
