import { useLocation, useParams } from 'react-router-dom';
import { Chat as ChatComponent } from '@/components/chat/Chat';

const Chat = () => {
  const location = useLocation();
  const { roomId } = useParams<{ roomId: string }>();
  const { userName, isCreating, avatarUrl, avatarData } = location.state || {};

  // Se não há dados da sala, redirecionar para lobby
  if (!roomId || !userName || !avatarUrl) {
    window.location.href = '/lobby';
    return null;
  }

  return <ChatComponent roomId={roomId} userName={userName} isCreating={isCreating} avatarUrl={avatarUrl} avatarData={avatarData} />;
};

export default Chat;