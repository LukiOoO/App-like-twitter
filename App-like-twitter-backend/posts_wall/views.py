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
                post_count = self.get_queryset().count()
                if post_count == 0:
                    return Response("No posts")

                latest_posts_size = int(post_count * 0.4)
                popular_posts_size = int(post_count * 0.4)
                random_posts_size = int(post_count * 0.2)

                latest_posts = self.get_queryset().all().order_by(
                    '-created_at')[:latest_posts_size]

                popular_posts = self.get_queryset().annotate(num_likes=Count(
                    'like')).order_by('-num_likes')[:popular_posts_size]

                all_posts = self.get_queryset().all()

                remaining_posts = all_posts.exclude(
                    id__in=[post.id for post in latest_posts]).exclude(
                    id__in=[post.id for post in popular_posts])

                random_posts = sample(list(remaining_posts), random_posts_size)

                random_post_sample = random_posts[:random_posts_size]

                if latest_posts in popular_posts:
                    random_posts_size = int(post_count * 0.4)

                combined_posts = list(latest_posts) + list(popular_posts) + \
                    list(random_post_sample)

                no_repet_posts = []
                post_ids = set()
                for post in combined_posts:
                    if post.id not in post_ids:
                        no_repet_posts.append(post)
                        post_ids.add(post.id)
                posts_page = self.paginate_queryset(no_repet_posts)
                if posts_page is not None:
                    serializer = self.get_serializer(posts_page, many=True)
                    return self.get_paginated_response(serializer.data)

            post_count = self.get_queryset().count()
            if post_count == 0:
                return Response("No posts")

            follow_tags_size = int(post_count * 0.3)
            follow_users_posts_size = int(post_count * 0.5)
            random_posts_size = int(post_count * 0.1)
            latest_posts_size = int(post_count * 0.1)

            liked_tags = Like.objects.filter(
                user=request.user).values_list('posts', flat=True)

            tags = Tags.objects.filter(
                post__in=liked_tags).values_list('tag', flat=True)

            simlar_posts = Post.objects.filter(
                tags__tag__in=tags).exclude(user=request.user).exclude(pk__in=liked_tags)

            try:
                simlar_posts_sample = sample(
                    list(simlar_posts), follow_tags_size)
            except ValueError:
                simlar_posts_sample = list(
                    simlar_posts) + sample(list(Post.objects.all().exclude(user=request.user)), follow_tags_size)

            following_users = request.user.following.all()
            followed_user_posts = Post.objects.filter(user__in=following_users)

            try:
                follow_users_posts_sample = sample(
                    list(followed_user_posts), follow_users_posts_size)
            except ValueError:
                follow_users_posts_sample = list(
                    followed_user_posts) + sample(list(Post.objects.all().exclude(user=request.user)), follow_tags_size)

            latest_posts = self.get_queryset().all().order_by(
                '-created_at')[:latest_posts_size]

            all_posts = self.get_queryset().all()

            remaining_posts = all_posts.exclude(
                id__in=[post.id for post in follow_users_posts_sample]).exclude(
                id__in=[post.id for post in simlar_posts_sample]).exclude(
                id__in=[post.id for post in latest_posts]).exclude(
                user=request.user)

            random_posts = sample(list(remaining_posts), random_posts_size)

            combined_posts = list(random_posts) + list(simlar_posts_sample) + \
                list(follow_users_posts_sample) + list(latest_posts)

            no_repet_posts = []
            post_ids = set()
            for post in combined_posts:
                if post.id not in post_ids:
                    no_repet_posts.append(post)
                    post_ids.add(post.id)
            posts_page = self.paginate_queryset(no_repet_posts)
            if posts_page is not None:
                serializer = self.get_serializer(posts_page, many=True)
                return self.get_paginated_response(serializer.data)
            # all_posts = self.get_queryset().all()
            # serializer = self.get_serializer(all_posts, many=True)
            # return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_403_FORBIDDEN)

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

