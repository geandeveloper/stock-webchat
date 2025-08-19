import { useState, useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import { generateGuid } from '@/utils/guid';

interface UseChatProps {
  roomId: string;
  userName: string;
  roomTitle: string;
  avatarUrl: string;
  isCreating: boolean;
}

export const useChat = ({ roomId, userName, roomTitle, avatarUrl, isCreating }: UseChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connectToRoom = () => {
      const eventSource = new EventSource(`http://localhost:5000/rooms/${roomId}/join`);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('Connected to room:', roomId);
        setIsConnected(true);

        const welcomeMessage: Message = {
          id: generateGuid(),
          sender: 'DevChat',
          content: `${isCreating ? '🎉 Sala criada com sucesso!' : '👋 Bem-vindo à sala!'}\n\nSala: ${roomId}\nUse comandos como /stock ou converse normalmente.`,
          type: 'bot',
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      };

      eventSource.addEventListener('messageReceived', (event) => {
        try {
          const data = JSON.parse(event.data);

          const newMessage: Message = {
            id: generateGuid(),
            sender: data.UserName || data.UserName || 'Unknown',
            content: data.Message || data.MessageText || data.message || '',
            type: data.FromType == 1 ? 'user' : 'bot',
            timestamp: new Date(data.Timestamp || Date.now()),
            avatarUrl: data.UserAvatar
          };

          setMessages(prev => [...prev, newMessage]);
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      });

      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        setIsConnected(false);

        // Reconnect after 3 seconds
        setTimeout(() => {
          if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
            connectToRoom();
          }
        }, 3000);
      };
    };

    connectToRoom();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [roomId, userName, avatarUrl, isCreating]);


  const sendMessage = async (content: string) => {
    try {
      // Send user message to backend
      const response = await fetch(`http://localhost:5000/rooms/${roomId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          MessageText: content,
          UserName: userName,
          UserAvatar: avatarUrl,
          RoomTitle: roomTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return {
    messages,
    roomId,
    isConnected,
    sendMessage,
  };
};