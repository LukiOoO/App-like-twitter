import axios, { InternalAxiosRequestConfig, Method } from "axios";
import Cookies from "js-cookie";
import { RegisterPayload } from "@/types/interfaces/interfaces";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const apiInstance = axios.create({
  baseURL: BASE_URL,
});

apiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("access");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `JWT ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface RequestOptions {
  url: string;
  method?: Method;
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

export const apiCall = async <T>(options: RequestOptions): Promise<T> => {
  try {
    const response = await apiInstance.request<T>({
      url: options.url,
      method: options.method,
      data: options.data,
      headers: options.headers,
      params: options.params,
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const createPostApi = async (formData: FormData): Promise<void> => {
  await apiInstance.post("/p_w/user-post-manager/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const createCommentApi = async (
  postId: string,
  formData: FormData
): Promise<void> => {
  await apiInstance.post(`/p_w/show_user_posts/${postId}/comments/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const createTagApi = async (tag: string): Promise<any> => {
  const response = await apiInstance.post("/t/user-tags-list/", { tag });
  return response.data;
};

export const editCommentApi = async (
  postId: string,
  commentId: string,
  formData: FormData
): Promise<void> => {
  await apiInstance.put(
    `/p_w/show_user_posts/${postId}/comments/${commentId}/`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};

export const deleteCommentApi = async (
  postId: string,
  commentId: string
): Promise<void> => {
  await apiInstance.delete(
    `/p_w/show_user_posts/${postId}/comments/${commentId}/`
  );
};

export const getTagsApi = async (): Promise<any[]> => {
  const response = await apiInstance.get("/t/all-tags/");
  return response.data;
};

export const getPostsApi = async (
  url: string = "/p_w/show_user_posts/"
): Promise<any> => {
  const response = await apiInstance.get(url);
  return response.data;
};

export const getPostCommentsApi = async (postId: number): Promise<any[]> => {
  try {
    const response = await apiInstance.get(
      `/p_w/show_user_posts/${postId}/comments/`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

export const searchPostsOrUsersApi = async (query: string): Promise<any> => {
  const isUser = !query.startsWith("#");
  const constructedUrl = isUser
    ? `/u/search-user-profile/?user_name=${query}`
    : `/p_w/search-post-by-tags/?tag_name=${encodeURIComponent(query.toUpperCase())}`;
  const response = await apiInstance.get(constructedUrl);
  return { isUser, data: response.data };
};

export const likePostApi = async (postId: number): Promise<any> => {
  const response = await apiInstance.post("/p_w/show_user_posts/", {
    follow_unfollow_post: postId,
  });
  return response.data;
};

export const loginUserApi = async (userData: {
  nickname: string;
  password: string;
}) => {
  const response = await axios.post(`${BASE_URL}/u/jwt/create`, userData);
  return response.data;
};

export const getUserDataApi = async (): Promise<any> => {
  const response = await apiInstance.get("/u/users/me/");
  return response.data;
};

export const updateUserDataApi = async (userData: {
  nickname: string;
  email: string;
  avatar: string;
  freeze_or_not: boolean;
}): Promise<any> => {
  const response = await apiInstance.put("/u/users/me/", userData);
  return response.data;
};

export const getFollowersApi = async (): Promise<any> => {
  const response = await apiInstance.get("/u/your-followers/");
  return response.data["Your followers"];
};

export const getFollowingApi = async (): Promise<any> => {
  const response = await apiInstance.get("/u/you-are-following/");
  return response.data["You are following"];
};

export const getUserTagsApi = async (): Promise<any> => {
  const response = await apiInstance.get("/t/user-tags-list/");
  return response.data["Your tags"];
};

export const getUserPostsApi = async (nickname: string): Promise<any> => {
  const response = await apiInstance.get(
    `/u/search-user-posts/?user_name=${nickname}`
  );
  return response.data;
};

export const getUserCommentsApi = async (): Promise<any> => {
  const response = await apiInstance.get("/u/all-user-comments/");
  return response.data["Your comments"];
};

export const sendResetPasswordEmailApi = async (
  email: string
): Promise<any> => {
  const response = await axios.post(`${BASE_URL}/u/users/reset_password/`, {
    email,
  });
  return response.data;
};

export const updateUserAvatarApi = async (formData: FormData): Promise<any> => {
  const response = await apiInstance.put("/u/user-avatar-update/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getPostDetailApi = async (postId: string): Promise<any> => {
  const response = await apiInstance.get(`/p_w/post-detail/?post_id=${postId}`);
  return response.data;
};

export const getPostDetailsCommentsApi = async (
  postId: string
): Promise<any> => {
  const response = await apiInstance.get(
    `/p_w/show_user_posts/${postId}/comments/`
  );
  return response.data;
};

export const followUnfollowApi = async (postId: string): Promise<any> => {
  const response = await apiInstance.post("/p_w/show_user_posts/", {
    follow_unfollow_post: postId,
  });
  return response.data;
};

export const getPostsApiUn = async (
  url: string = "/p_w/show_user_posts/"
): Promise<any> => {
  const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;
  const response = await axios.get(fullUrl);
  return response.data;
};

export const getPostCommentsApiUn = async (post_id: number): Promise<any[]> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/p_w/show_user_posts/${post_id}/comments/`
    );
    return response.data;
  } catch (error: any) {
    return [];
  }
};

export async function registerUserAPI(payload: RegisterPayload): Promise<any> {
  const response = await axios.post(`${BASE_URL}/u/users/`, payload);
  return response.data;
}

export async function getUserDataAPI(nickname: string): Promise<any> {
  const response = await apiInstance.get(
    `/u/search-user-profile/?user_name=${nickname}`
  );
  return response.data;
}

export async function getUserPostsAPI(nickname: string): Promise<any> {
  const response = await apiInstance.get(
    `/u/search-user-posts/?user_name=${nickname}`
  );
  return response.data;
}

export async function getUserCommentsAPI(nickname: string): Promise<any> {
  const response = await apiInstance.get(
    `/c/show-user-comments/?user_nickname=${nickname}`
  );
  return response.data;
}

export async function followUnFollowUserAPI(
  userId: number,
  canFollow: boolean
): Promise<any> {
  const endpoint = canFollow ? "/u/you-can-follow/" : "/u/you-can-unfollow/";
  const payload = canFollow
    ? { follow_user: userId }
    : { unfollow_user: userId };
  const response = await apiInstance.post(endpoint, payload);
  return response.data;
}

export async function getUserProfile(): Promise<any> {
  const response = await apiInstance.get("/u/auth/users/me/");
  return response.data;
}

export async function updatePostAPI(
  postId: number,
  formData: FormData
): Promise<any> {
  const response = await apiInstance.put(
    `/p_w/user-post-manager/${postId}/`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
}
