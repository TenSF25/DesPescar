export type ChatRole = 'user' | 'koi';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  createdAt: string;
}
