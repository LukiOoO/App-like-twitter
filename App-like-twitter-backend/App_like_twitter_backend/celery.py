import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      'App_like_twitter_backend.settings.dev')

celery = Celery('App_like_twitter_backend')
celery.config_from_object('django.conf:settings', namespace='CELERY')
celery.autodiscover_tasks()
