import logging
from django.contrib.auth.models import AnonymousUser
from django.db.models import Count
from random import sample
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from App_like_twitter_backend.pagination import DefaultPagination
from .serializers import UserpPostManagerSerializer, ShowUserPostsSerializer, SearchPostByTagsSerializer
from tags.models import Tags
from .models import Post, Like
from users.permissions import IsAnonymousUser, FreezeAccountPermission
from .permissions import IsProfileOwnerPostMg

logging.getLogger(__name__)

class PostDetails(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ShowUserPostsSerializer
    queryset = Post.objects.all()

    def list(self, request, *args, **kwargs):
        try:
            post_id = request.query_params.get('post_id')
            if post_id:
                posts = self.queryset.filter(id=post_id)
                serializer = self.get_serializer(posts, many=True)
                return Response(serializer.data)
            return Response({'detail': 'No post with this id.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status=status.HTTP_403_FORBIDDEN)


class UserPostManager(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = UserpPostManagerSerializer
    permission_classes = [IsAuthenticated,
                          IsProfileOwnerPostMg, FreezeAccountPermission]

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(str(e), status=status.HTTP_403_FORBIDDEN)

    def list(self, request, *args, **kwargs):
        try:
            users_posts = Post.objects.filter(user=self.request.user)
            serializer = self.get_serializer(users_posts, many=True)
            if not serializer.data:
                return Response("You haven't created any Post ")
            return Response({'Your posts': serializer.data})
        except Exception as e:
            return Response(str(e), status=status.HTTP_403_FORBIDDEN)

    def retrieve(self, request, *args, **kwargs):
        try:
            post_id = kwargs['pk']
            post = Post.objects.filter(
                id=post_id, user=self.request.user).first()
            if not post:
                return Response("post not found", status=status.HTTP_404_NOT_FOUND)
            serializer = self.get_serializer(post)
            return Response({'Your post': serializer.data})
        except Exception as e:
            return Response(str(e), status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, *args, **kwargs):
        try:
            post_id = kwargs['pk']
            post = Post.objects.filter(
                id=post_id, user=self.request.user).first()
            if not post:
                return Response("post not found", status=status.HTTP_404_NOT_FOUND)
            post.delete()
            return Response("post deleted successfully", status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(str(e), status=status.HTTP_403_FORBIDDEN)

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        except Exception as e:
            return Response(str(e), status=status.HTTP_403_FORBIDDEN)


class SearchPostByTags(viewsets.GenericViewSet):
    serializer_class = SearchPostByTagsSerializer
    pagination_class = DefaultPagination
    queryset = Post.objects.all()

    def list(self, request, *args, **kwargs):
        try:
            tag_name = request.query_params.get('tag_name')
            if tag_name:
                posts = self.queryset.filter(tags__tag__iexact=tag_name)
                page = self.paginate_queryset(posts)
                if page is not None:
                    serializer = self.get_serializer(page, many=True)
                    return self.get_paginated_response(serializer.data)
                serializer = self.get_serializer(posts, many=True)
                return Response(serializer.data)
            return Response({'detail': 'Tag name is required.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status=status.HTTP_403_FORBIDDEN)


class ShowUserPosts(viewsets.GenericViewSet):
    queryset = Post.objects.all()
    serializer_class = ShowUserPostsSerializer
    pagination_class = DefaultPagination

    def get_permissions(self):
        if self.action == 'list':
            return [IsAnonymousUser()]
        return [IsAuthenticated(), IsProfileOwnerPostMg(), FreezeAccountPermission()]

    def list(self, request, *args, **kwargs):
        try:
            if isinstance(request.user, AnonymousUser):
                return self._handle_anonymous_user(request)
            else:
                return self._handle_authenticated_user(request)
        except Exception as e:
            logging.error(f"Error in ShowUserPosts.list: {e}")
            return Response({"error": "An error occurred while fetching posts."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _handle_anonymous_user(self, request):
        post_count = self.get_queryset().count()
        if post_count == 0:
            return Response("No posts available.", status=status.HTTP_200_OK)

        latest_posts_size = max(int(post_count * 0.4), 1)
        popular_posts_size = max(int(post_count * 0.4), 1)
        random_posts_size = max(int(post_count * 0.2), 1)

        latest_posts_qs = self.get_queryset().all().order_by('-created_at')[:latest_posts_size]
        latest_posts = list(latest_posts_qs)

        popular_posts_qs = self.get_queryset().annotate(num_likes=Count('like')).order_by('-num_likes')[:popular_posts_size]
        popular_posts = list(popular_posts_qs)

        excluded_ids = set(post.id for post in latest_posts + popular_posts)

        remaining_posts_qs = self.get_queryset().exclude(id__in=excluded_ids)
        remaining_posts = list(remaining_posts_qs)

        if len(remaining_posts) >= random_posts_size:
            random_posts = sample(remaining_posts, random_posts_size)
        else:
            random_posts = remaining_posts.copy()
            needed = random_posts_size - len(random_posts)
            additional_posts_qs = self.get_queryset().exclude(id__in=excluded_ids | set(post.id for post in random_posts))
            additional_posts = list(additional_posts_qs)
            if additional_posts:
                additional_sample = sample(additional_posts, min(needed, len(additional_posts)))
                random_posts.extend(additional_sample)

        combined_posts = latest_posts + popular_posts + random_posts

        unique_posts = []
        seen_ids = set()
        for post in combined_posts:
            if post.id not in seen_ids:
                unique_posts.append(post)
                seen_ids.add(post.id)

        paginated_posts = self.paginate_queryset(unique_posts)
        if paginated_posts is not None:
            serializer = self.get_serializer(paginated_posts, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(unique_posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def _handle_authenticated_user(self, request):
        post_count = self.get_queryset().count()
        if post_count == 0:
            return Response("No posts available.", status=status.HTTP_200_OK)

        follow_tags_size = max(int(post_count * 0.3), 1)
        follow_users_posts_size = max(int(post_count * 0.5), 1)
        random_posts_size = max(int(post_count * 0.1), 1)
        latest_posts_size = max(int(post_count * 0.1), 1)

        liked_posts_ids = Like.objects.filter(user=request.user).values_list('posts', flat=True)

        liked_tags = Tags.objects.filter(post__in=liked_posts_ids).values_list('tag', flat=True)

        similar_posts_qs = Post.objects.filter(tags__tag__in=liked_tags).exclude(user=request.user).exclude(id__in=liked_posts_ids)
        similar_posts = list(similar_posts_qs)

        if len(similar_posts) >= follow_tags_size:
            sampled_similar_posts = sample(similar_posts, follow_tags_size)
        else:
            sampled_similar_posts = similar_posts.copy()
            needed = follow_tags_size - len(sampled_similar_posts)
            additional_similar_qs = Post.objects.filter(tags__tag__in=liked_tags).exclude(user=request.user).exclude(id__in=liked_posts_ids | set(post.id for post in sampled_similar_posts))
            additional_similar_posts = list(additional_similar_qs)
            if additional_similar_posts:
                additional_sample = sample(additional_similar_posts, min(needed, len(additional_similar_posts)))
                sampled_similar_posts.extend(additional_sample)

        following_users = request.user.following.all()

        followed_user_posts_qs = Post.objects.filter(user__in=following_users)
        followed_user_posts = list(followed_user_posts_qs)

        if len(followed_user_posts) >= follow_users_posts_size:
            sampled_followed_posts = sample(followed_user_posts, follow_users_posts_size)
        else:
            sampled_followed_posts = followed_user_posts.copy()
            needed = follow_users_posts_size - len(sampled_followed_posts)
            additional_followed_qs = Post.objects.filter(user__in=following_users).exclude(id__in=set(post.id for post in sampled_followed_posts))
            additional_followed_posts = list(additional_followed_qs)
            if additional_followed_posts:
                additional_sample = sample(additional_followed_posts, min(needed, len(additional_followed_posts)))
                sampled_followed_posts.extend(additional_sample)

        latest_posts_qs = self.get_queryset().all().order_by('-created_at')[:latest_posts_size]
        latest_posts = list(latest_posts_qs)

        excluded_ids = set(post.id for post in sampled_similar_posts + sampled_followed_posts + latest_posts)

        remaining_posts_qs = self.get_queryset().exclude(id__in=excluded_ids).exclude(user=request.user)
        remaining_posts = list(remaining_posts_qs)

        if len(remaining_posts) >= random_posts_size:
            random_posts = sample(remaining_posts, random_posts_size)
        else:
            random_posts = remaining_posts.copy()
            needed = random_posts_size - len(random_posts)
            additional_random_qs = self.get_queryset().exclude(id__in=excluded_ids | set(post.id for post in random_posts))
            additional_random_posts = list(additional_random_qs)
            if additional_random_posts:
                additional_sample = sample(additional_random_posts, min(needed, len(additional_random_posts)))
                random_posts.extend(additional_sample)

        combined_posts = sampled_similar_posts + sampled_followed_posts + random_posts + latest_posts

        unique_posts = []
        seen_ids = set()
        for post in combined_posts:
            if post.id not in seen_ids:
                unique_posts.append(post)
                seen_ids.add(post.id)

        paginated_posts = self.paginate_queryset(unique_posts)
        if paginated_posts is not None:
            serializer = self.get_serializer(paginated_posts, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(unique_posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        try:
            follow_post_id = request.data.get('follow_unfollow_post')
            try:
                post = Post.objects.get(id=follow_post_id)
            except Post.DoesNotExist:
                return Response({'error': 'Invalid post ID'}, status=status.HTTP_400_BAD_REQUEST)
            like_exist = Like.objects.filter(posts=post, user=request.user).exists()
            if like_exist:
                Like.objects.filter(posts=post, user=request.user).delete()
                return Response({'detail': "Unfollowed post successfuly"}, status=status.HTTP_200_OK)
            Like.objects.create(posts=post, user=request.user)
            return Response({'detail': "Follow post successfuly"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_403_FORBIDDEN)

