from rest_framework import serializers
from .models import Comments
from django.conf import settings
import mimetypes


class CommentsSerializer(serializers.ModelSerializer):
    user_id = serializers.SerializerMethodField()
    post_id = serializers.SerializerMethodField()
    user_nickname = serializers.SerializerMethodField()
    image = serializers.ImageField(allow_null=True, required=False)
    video = serializers.FileField(allow_null=True, required=False)
    gif = serializers.ImageField(allow_null=True, required=False)
    created_at = serializers.DateTimeField(read_only=True)
    


    def get_user_id(self, obj):
        user = obj.user.id
        return user
    
    def get_user_nickname(self, obj):
        user = obj.user.nickname
        return user
    
    def get_post_id(self, obj):
        post_id = obj.post.id
        return post_id
    

    class Meta:
        model = Comments
        fields = ['id','post_id', 'user_id','user_nickname', 'text',
                  'image', 'video', 'gif','created_at']

    def create(self, validated_data):
        post_id = self.context['post_id']
        user_id = self.context['user_id']
        return Comments.objects.create(post_id=post_id, user_id=user_id, **validated_data)
    
class ShowUserCommentsSerializer(serializers.ModelSerializer):
    user_id = serializers.SerializerMethodField()
    post_id = serializers.SerializerMethodField()
    user_nickname = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    video = serializers.SerializerMethodField()
    gif = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(read_only=True)
    


    def get_user_id(self, obj):
        user = obj.user.id
        return user
    
    def get_user_nickname(self, obj):
        user = obj.user.nickname
        return user
    
    def get_post_id(self, obj):
        post_id = obj.post.id
        return post_id
    
    def get_image(slef, obj):
        if obj.image:  
            return f"{settings.BASE_URL}{obj.image.url}"
        return None  
    
    def get_video(slef, obj):
        if obj.video:  
            return f"{settings.BASE_URL}{obj.video.url}"
        return None  
    
    def get_gif(slef, obj):
        if obj.gif:  
            return f"{settings.BASE_URL}{obj.gif.url}"
        return None  
    

    class Meta:
        model = Comments
        fields = ['id','post_id', 'user_id','user_nickname', 'text',
                  'image', 'video', 'gif','created_at']
        



