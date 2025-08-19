import { MessageProps } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';

export const MessageComponent = ({ message }: MessageProps) => {
  const isUser = message.type === 'user';
  const isCommand = message.content.startsWith('@');

  // Default bot avatar
  const defaultBotAvatar = 'https://api.dicebear.com/7.x/bottts/svg?seed=DevChatBot&backgroundColor=6F42C1';

  return (
    <div
      className={cn(
        'flex w-full message-slide-in gap-3 p-2',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {/* Avatar - mostrar no início para bots e no final para usuários */}
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full border border-vs-purple/30 overflow-hidden bg-vs-purple/10 flex items-center justify-center">
            {message.type === 'bot' ? (
              <Bot size={20} className="text-vs-purple" />
            ) : (
              <img 
                src={message.avatarUrl || defaultBotAvatar} 
                alt={message.sender} 
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      )}

      <div
        className={cn(
          'max-w-[70%] rounded-lg px-4 py-3 shadow-lg',
          isUser ? 'message-user' : 'message-bot',
          isUser && isCommand && 'glow-purple'
        )}
      >
        {/* Sender name */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold opacity-90">
            {message.sender}
          </span>
          {isCommand && (
            <span className="text-xs px-2 py-0.5 bg-black/20 rounded-full">
              CMD
            </span>
          )}
        </div>

        {/* Message content */}
        <div 
          className={cn(
            'text-sm leading-relaxed whitespace-pre-wrap break-words',
            message.content.includes('•') ? 'font-mono text-xs' : ''
          )}
        >
          {message.content}
        </div>

        {/* Timestamp */}
        <div className="text-xs opacity-70 mt-2">
          {message.timestamp.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      {/* Avatar do usuário */}
      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full border border-vs-purple overflow-hidden">
            <img 
              src={message.avatarUrl || defaultBotAvatar} 
              alt={message.sender} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};