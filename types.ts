
export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface VideoItem {
  title: string;
  url: string;
  thumbnail?: string;
}

export type Page = 'home' | 'about' | 'chat' | 'video' | 'qna' | 'sawer';
