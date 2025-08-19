export interface Message {
  id: string;
  sender: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
  avatarUrl?: string;
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export interface MessageListProps {
  messages: Message[];
}

export interface MessageProps {
  message: Message;
}