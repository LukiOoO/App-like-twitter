# Generated by Django 4.2.1 on 2023-06-16 15:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_followingusers_followersusers'),
    ]

    operations = [
        migrations.RenameField(
            model_name='followingusers',
            old_name='followin_users',
            new_name='following_users',
        ),
    ]
