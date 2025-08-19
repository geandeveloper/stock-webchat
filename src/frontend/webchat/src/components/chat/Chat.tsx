import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Wifi, WifiOff } from 'lucide-react';
import logo from '@/assets/devchat-logo.png';
import { useChat } from '@/hooks/useChat';

interface ChatProps {
  roomId: string;
  userName: string;
  userId: string;
  isCreating: boolean;
  avatarUrl: string;
  avatarData: any;
}

export const Chat = ({ roomId, userName, isCreating, avatarUrl, avatarData }: ChatProps) => {
  const navigate = useNavigate();
  const { messages, isConnected, sendMessage } = useChat({
    roomId,
    userName,
    roomTitle: roomId, // usando roomId como roomTitle por enquanto
    avatarUrl,
    isCreating,
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/lobby')}
              className="p-2"
            >
              <ArrowLeft size={16} />
            </Button>
            
            <img src={logo} alt="DevChat" className="w-8 h-8 rounded-lg" />
            
            <div>
              <h1 className="text-lg font-semibold font-mono">DevChat</h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users size={12} />
                <span>#{roomId.slice(-8)}</span>
                {isConnected ? (
                  <Wifi size={12} className="text-green-500" />
                ) : (
                  <WifiOff size={12} className="text-red-500" />
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <img src={avatarUrl} alt={userName} className="w-8 h-8 rounded-full border border-vs-purple" />
            <div className="text-right">
              <div className="text-sm font-mono">{userName}</div>
              <div className="text-xs text-muted-foreground">
                {isCreating ? 'Criador da sala' : 'Participante'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};