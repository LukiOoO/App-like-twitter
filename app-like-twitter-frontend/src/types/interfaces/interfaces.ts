export interface PostObj {
  post_id: number;
  user_id: number;
  user: string;
  tags: string[];
  created_at: string;
  text: string;
  image?: string;
  gif?: string;
  video?: string;
  likes: {
    count: number;
    liked_by: string[];
  };
}

export interface CommentsByPost {
  [postId: number]: Comment[];
}

export interface CommentInterface {
  comment_id: number;
  user_nickname: string;
  text: string;
  image?: string;
  gif?: string;
  video?: string;
  created_at: string;
  comment: Comment;
}

export interface UserData {
  nickname: string;
  email: string;
  avatar: string;
  freeze_or_not: boolean;
}

export interface CommentType {
  gif: string | null;
  id: number;
  image: string | null;
  text: string;
  user_id: number;
  user_nickname: string;
  video: string | null;
  post_id: number;
}
