# admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model

User = get_user_model()

class FollowerInline(admin.TabularInline):
    model = User.followers.through  
    fk_name = 'to_user'  
    verbose_name = 'Follower'
    verbose_name_plural = 'Followers'
    extra = 1  
    can_delete = True  
    fields = ('from_user', ) 
    raw_id_fields = ('from_user', ) 
    raw_id_fields = ('from_user', ) 
@admin.register(User)
class AdminUser(UserAdmin):
    prepopulated_fields = {
        'slug': ['nickname']
    }

    list_display = [
        'email', 'nickname',
        'staff', 'is_active',
        'avatar', 'freeze_or_not'
    ]

    list_filter = ['staff', 'groups'] 

    list_per_page = 15
    list_editable = ['is_active', 'freeze_or_not']
    ordering = ['email', 'nickname']

    search_fields = ['nickname__istartswith', 'email__istartswith']

    fieldsets = (
        (None, {'fields': ('email', 'nickname', 'slug', 'avatar')}),
        ('Permissions', {'fields': ('staff', 'groups')}), 
        ('Password', {'fields': ('password',)}),
        ('Followers and Following', {'fields': ('following', 'followers_display')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email', 'nickname', 'password1',
                'password2', 'slug', 'is_active',
                'staff', 'groups', 
            )
        }),
    )

    filter_horizontal = ('groups', 'following')

    readonly_fields = ('followers_display',)
    inlines = [FollowerInline]

    def followers_display(self, obj):
        return ", ".join([follower.nickname for follower in obj.followers.all()])
    followers_display.short_description = 'Followers'
