from .common import *

DEBUG = True

SECRET_KEY = 'django-insecure-_mg4g5=g9fxz*r1%%6cwr^my)ft733g3djj7zg291wlp6*mjtk'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME':  'app_l_tt',
        'HOST': 'mysql',  # db nazwa usługi w docker-compose 
        'USER': 'root',
        'PASSWORD': 'P@ssword',
    }
}

CELERY_BROKER_URL = 'redis://host.docker.internal:6379/1'

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://host.docker.internal:6379/2",
        "TIMEOUT": 10 * 60,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp4dev'
EMAIL_HOST_USER = ''
EMAIL_HOST_PASSWORD = ''
EMAIL_PORT = 25
DEFAULT_FROM_EMAIL = 'appLtt@site.com'


DEBUG_TOOLBAR_CONFIG = {
    'SHOW_TOOLBAR_CALLBACL': lambda request: True
}
