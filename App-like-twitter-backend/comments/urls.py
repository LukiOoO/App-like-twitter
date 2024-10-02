from rest_framework_nested import routers
from . import views

router = routers.DefaultRouter()
router.register('show-user-comments', views.ShowUserComments, basename='show-user-comments')


urlpatterns = router.urls
