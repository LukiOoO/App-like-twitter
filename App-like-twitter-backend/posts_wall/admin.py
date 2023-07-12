from django.contrib import admin
from .models import Post
from comments.models import Comments


class CommentsInline(admin.TabularInline):
    model = Comments


@admin.register(Post)
class PostsAdmin(admin.ModelAdmin):
    list_display = ['user', 'tags_list', 'created_at', 'text']

    inlines = [
        CommentsInline,
    ]
    search_fields = ['user__nickname']

    def tags_list(self, obj):
        return ", ".join([tag.tag for tag in obj.tags.all()])
    tags_list.short_description = 'Tags'
