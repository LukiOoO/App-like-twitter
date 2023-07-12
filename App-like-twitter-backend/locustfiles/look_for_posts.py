from locust import HttpUser, task, between
from random import randint


class WebSiteUser(HttpUser):
    wait_time = between(1, 5)

    @task(2)
    def view_posts(self):
        print('view posts')
        self.client.get('/p_w/show_user_posts/')

    @task(4)
    def view_post(self):
        print('view post')
        random_post = randint(0, 2)
        self.client.get(
            f'/p_w/show_user_posts/{random_post}/comments')
