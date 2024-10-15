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

export interface Comment {
  comment_id: number;
  user_nickname: string;
  text: string;
  image?: string;
  gif?: string;
  video?: string;
  created_at: string;
}
