from django.contrib import admin
from . import models
# Register your models here.


@admin.register(models.AppContentByProgrammer)
class AppContentByProgrammerAdmin(admin.ModelAdmin):
    content = models.AppContentByProgrammer()
    list_display = ['name', 'created_at']
    list_per_page = 15
