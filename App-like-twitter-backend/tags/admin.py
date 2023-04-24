from django.contrib import admin
from .models import Tags
from django import forms
from django.core.exceptions import ValidationError
from django.contrib import admin

from .models import Tags


class TagsAdminForm(forms.ModelForm):
    class Meta:
        model = Tags
        fields = '__all__'

    def clean_tag(self):
        tag = self.cleaned_data.get('tag', '')

        if not tag.startswith('#'):
            tag = '#' + tag

        existing_tags = Tags.objects.filter(tag=tag)
        if self.instance.pk:
            existing_tags = existing_tags.exclude(pk=self.instance.pk)
        if existing_tags.exists():
            raise ValidationError('Tag with this name already exists.')

        return tag


@admin.register(Tags)
class TagsAdmin(admin.ModelAdmin):
    content = Tags()
    list_display = ['user', 'tag']
    list_per_page = 15
    search_fields = ['user', 'tag']
    form = TagsAdminForm
