import { AppRouter } from "@/types/router";

export const handleRedirectClick = (
  router: AppRouter,
  postId?: number
): void => {
  router.push(`/post/${postId}`);
};

export const moveToUserProfile = (
  router: AppRouter,
  nickname?: string
): void => {
  router.push(`/userProfile/${nickname}`);
};
