"""
URL configuration for App_like_twitter_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

admin.site.site_header = 'App like twitter  Admin'
admin.site.index_title = 'Admin'



urlpatterns = [
    path('', include('home.urls')),
    path('admin/', admin.site.urls),
    path('c/', include('comments.urls')),
    path('p_w/', include('posts_wall.urls')),
    path('t/', include('tags.urls')),
    path('a_f_g_P_u/', include('app_for_getting_photo_url.urls')),
    path('s/', include('sending.urls')),
    path('u/', include('users.urls')),
    path('u/', include('djoser.urls')),
    path('u/', include('djoser.urls.jwt')),

    path('__debug__/', include('debug_toolbar.urls')),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)
    urlpatterns += [path('silk/', include('silk.urls', namespace='silk'))]
