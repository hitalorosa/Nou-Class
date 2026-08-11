export type Role = "user" | "admin";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: Role;
  access_granted: boolean;
  created_at: string;
};

export type Course = {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  is_published: boolean;
  position: number;
  created_at: string;
  updated_at: string;
};

export type Lesson = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  youtube_id: string | null;
  is_published: boolean;
  position: number;
  created_at: string;
  updated_at: string;
};

export type LessonProgress = {
  user_id: string;
  lesson_id: string;
  watched_at: string;
};
