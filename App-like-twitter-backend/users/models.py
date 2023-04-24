from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import Group


class UserManager(BaseUserManager):

    def create_user(self, email, nickname, password, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, nickname=nickname, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nickname, password):
        user = self.create_user(
            email=email,
            nickname=nickname,
            password=password)
        user.staff = True
        user.admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):

    email = models.EmailField(
        unique=True, max_length=255, verbose_name='email address')
    nickname = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    slug = models.SlugField()
    is_active = models.BooleanField(default=True)
    staff = models.BooleanField(default=False)
    admin = models.BooleanField(default=False)
    groups = models.ManyToManyField(
        Group, related_name='mathsite_users', blank=True)

    def __str__(self):
        return f'{self.nickname}'

    def save(self, *args, **kwargs):
        self.slug = self.nickname
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['email', 'nickname']

    USERNAME_FIELD = 'nickname'
    REQUIRED_FIELDS = ['email', 'password']

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.staff

    objects = UserManager()
