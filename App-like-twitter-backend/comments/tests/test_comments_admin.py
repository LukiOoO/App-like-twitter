from django.contrib import admin
from django.test import RequestFactory
from comments.admin import CommentsAdmin
from comments.models import Comments
import pytest


@pytest.mark.django_db
class TestCommentsAdmin:
    def test_list_display(self):
        request = RequestFactory().get('/admin/comments/')
        comments_admin = CommentsAdmin(model=Comments, admin_site=admin.site)
        comments_qs = Comments.objects.all()

        list_display = comments_admin.get_list_display(request)
        assert list(list_display) == ['user', 'created_at', 'post']

    def test_search_fields(self):
        request = RequestFactory().get('/admin/comments/')
        comments_admin = CommentsAdmin(model=Comments, admin_site=admin.site)

        search_fields = comments_admin.get_search_fields(request)
        assert search_fields == ['user__nickname']
