# Generated by Django 4.2 on 2023-04-22 10:21

import app_for_getting_photo_url.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_for_getting_photo_url', '0004_alter_appcontentbyprogrammer_file_field'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appcontentbyprogrammer',
            name='file_field',
            field=models.FileField(null=True, storage=app_for_getting_photo_url.models.StaticStorage(), upload_to='app_for_getting_photo_url/app_content'),
        ),
    ]
