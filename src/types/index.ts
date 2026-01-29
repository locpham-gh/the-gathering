export interface Resource {
  id: number;
  title: string;
  description: string;
  content_type: "guide" | "ebook" | "course";
  category: string;
  author: string;
  url: string;
  thumbnail_url: string;
  format: "pdf" | "mp4";
  status: "pending" | "approved" | "rejected";
  uploader_id: number;
  uploader_username?: string;
  created_at: string;
}

export interface User {
  username: string;
  email: string;
  role: string;
}
