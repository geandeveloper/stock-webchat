import { MessageListProps } from '@/types/chat';
import { MessageComponent } from './MessageComponent';

export const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageComponent key={message.id} message={message} />
      ))}
    </div>
  );
};