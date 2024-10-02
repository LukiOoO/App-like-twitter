from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied


class IsProfileOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj == request.user


class IsAnonymousUser(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return request.method == 'GET'
        return True


class FreezeAccountPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.freeze_or_not:
            raise PermissionDenied({'Your account is frozen' : request.user.email})
        return True
