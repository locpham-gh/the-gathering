export interface Room {
  id: number;
  title: string;
  code: string;
  member_count: number;
  message_count: number;
  creator_name: string;
  creator_id?: number;
  is_member?: boolean;
}

export interface Message {
  id: number;
  content: string;
  username: string;
  created_at: string;
  parent_id?: number;
  parent_content?: string;
  parent_username?: string;
}
