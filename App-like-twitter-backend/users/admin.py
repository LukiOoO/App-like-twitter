from django.contrib import admin
from . import models
from django.contrib.auth.admin import UserAdmin
# Register your models here.


@admin.register(models.User)
class AdminUser(UserAdmin):
    prepopulated_fields = {
        'slug': ['nickname']
    }

    list_display = ['email', 'nickname', 'is_staff', 'admin', 'is_active']
    list_filter = ['staff', 'groups']
    list_per_page = 15
    list_editable = ['is_active']
    ordering = ['email', 'nickname']
    search_fields = ['nickname__istartswith', 'email__istartswith']
    fieldsets = (
        (None, {'fields': ('email', 'nickname',  'slug', 'password')}),
        ('Permissions', {'fields': ('staff', 'groups')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nickname', 'password1',
                       'password2', 'slug',  'is_active', 'staff',
                       'admin', 'groups')}
         ),
    )
    search_fields = ('nickname', 'email')
    ordering = ('nickname',)
    filter_horizontal = ('groups',)
