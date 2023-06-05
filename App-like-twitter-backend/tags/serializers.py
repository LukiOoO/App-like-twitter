
from rest_framework import serializers
from .models import Tags


class UserTagsListSerializer(serializers.ModelSerializer):
    tag_id = serializers.IntegerField(source='id', read_only=True)
    tag = serializers.CharField()

    class Meta:
        model = Tags
        fields = ('tag_id', 'tag',)


class UsersTagsListSerializer(serializers.ModelSerializer):
    tag = serializers.ReadOnlyField()

    class Meta:
        model = Tags
        fields = ('tag',)
