from rest_framework import serializers
from tags.models import Tags
from .models import Post, Like
from PIL import Image
from rest_framework.exceptions import ValidationError


def validate_tags(value):
    if not value:
        raise serializers.ValidationError("At least one tag is required.")
    return value

class UserpPostManagerSerializer(serializers.ModelSerializer):
    post_id = serializers.IntegerField(source='id', read_only=True)
    text = serializers.CharField(max_length=255)
    created_at = serializers.DateTimeField(read_only=True)
    tags = serializers.SlugRelatedField(
        many=True,
        slug_field='tag',
        queryset=Tags.objects.all(),

    )
    likes = serializers.SerializerMethodField()
    image = serializers.ImageField(required=False, allow_null=True)

    def get_likes(self, obj):
        likes = Like.objects.filter(posts=obj)
        return likes.count()

    def validate(self, attrs):
        attrs = super().validate(attrs)
        tags = attrs.get('tags', [])
        validate_tags(tags)
        return attrs

    class Meta:
        model = Post
        fields = ["text", "image", "video", "gif",
                  "tags", "created_at", 'post_id', 'likes']


class ShowUserPostsSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    user_id = serializers.SerializerMethodField()
    post_id = serializers.IntegerField(source='id', read_only=True)
    likes = serializers.SerializerMethodField()
    tags = serializers.StringRelatedField(many=True, read_only=True)
    follow_unfollow_post = serializers.IntegerField(write_only=True)

    def get_user(self, obj):
        return obj.user.nickname
    def user_id(self, obj):
        return obj.user.id

    def get_likes(self, obj):
        likes = Like.objects.filter(posts=obj)
        likes_count = likes.count()
        liked_by = likes.values_list('user__nickname', flat=True)
        return {'count': likes_count, 'liked_by': liked_by}

    class Meta:
        model = Post
        fields = ['user',"user_id", "text", "image", "video", "gif",
                  "tags", "created_at", 'post_id', 'likes', 'follow_unfollow_post']
        read_only_fields = ['user',"user_id", "text", "image", "video", "gif",
                            "tags", "created_at", 'post_id', 'likes']


class SearchPostByTagsSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    user_id = serializers.SerializerMethodField()
    post_id = serializers.IntegerField(source='id', read_only=True)
    likes = serializers.SerializerMethodField()
    tags = serializers.StringRelatedField(many=True, read_only=True)
    follow_unfollow_post = serializers.IntegerField(write_only=True)

    def get_user(self, obj):
        return obj.user.nickname
    def user_id(self, obj):
        return obj.user.id

    def get_likes(self, obj):
        likes = Like.objects.filter(posts=obj)
        likes_count = likes.count()
        liked_by = likes.values_list('user__nickname', flat=True)
        return {'count': likes_count, 'liked_by': liked_by}

    class Meta:
        model = Post
        fields = ['user',"user_id", "text", "image", "video", "gif",
                  "tags", "created_at", 'post_id', 'likes', 'follow_unfollow_post']
        read_only_fields = ['user',"user_id", "text", "image", "video", "gif",
                            "tags", "created_at", 'post_id', 'likes']
