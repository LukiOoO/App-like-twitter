from rest_framework_nested import routers
from . import views


router = routers.DefaultRouter()

router.register('user-tags-list', views.UserTagsListView,
                basename='user-tags-list')
router.register('all-tags', views.GetAllUsersTagsView,
                basename='all-tags')


urlpatterns = router.urls
