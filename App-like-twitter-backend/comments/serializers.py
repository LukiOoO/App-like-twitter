from rest_framework import serializers
from .models import Comments


class CommentsSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(read_only=True)

    def get_user(self, obj):
        user = obj.user.id
        return user

    class Meta:
        model = Comments
        fields = ['id', 'user', 'text',
                  'image', 'video', 'gif', 'created_at']

    def create(self, validated_data):
        post_id = self.context['post_id']
        user_id = self.context['user_id']
        return Comments.objects.create(post_id=post_id, user_id=user_id, **validated_data)
