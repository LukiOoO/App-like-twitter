from . import views
from rest_framework_nested import routers
from comments.views import PostCommentsViews

router = routers.DefaultRouter()
router.register('user-post-manager', views.UserPostManager,
                basename='create-post')
router.register('show_user_posts', views.ShowUserPosts,
                basename='show_user_posts')

router.register('search-post-by-tags', views.SearchPostByTags,
                basename='search-post-by-tags')
router.register('post-detail', views.PostDetails, basename='search-post-details')
comments_router = routers.NestedDefaultRouter(
    router, 'show_user_posts', lookup='show_user_posts')
comments_router.register(
    'comments', PostCommentsViews, basename='post-comments')


urlpatterns = router.urls + comments_router.urls
