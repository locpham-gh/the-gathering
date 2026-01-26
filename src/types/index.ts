export interface Resource {
  id: number;
  title: string;
  description: string;
  content_type: "guide" | "ebook" | "course";
  category: string;
  author: string;
  url: string;
  thumbnail_url: string;
}

export interface User {
  username: string;
  email: string;
  role: string;
}
