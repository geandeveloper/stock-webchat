import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateJoinRoom } from '@/components/lobby/CreateJoinRoom';
import { Button } from '@/components/ui/button';
import { MessageSquareCode, Users, Sparkles } from 'lucide-react';
import logo from '@/assets/devchat-logo.png';

const Lobby = () => {
  const [showRoomForm, setShowRoomForm] = useState(false);
  const navigate = useNavigate();

  const handleRoomJoin = (roomData: { roomId: string; userName: string; isCreating: boolean; avatarUrl: string; avatarData: any }) => {
    // Navegar para o chat com o roomId na URL
    navigate(`/chat/${roomData.roomId}`, { 
      state: { 
        userName: roomData.userName,
        isCreating: roomData.isCreating,
        avatarUrl: roomData.avatarUrl,
        avatarData: roomData.avatarData
      } 
    });
  };

  if (showRoomForm) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <CreateJoinRoom 
            onRoomJoin={handleRoomJoin}
            onBack={() => setShowRoomForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-lg mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src={logo} 
            alt="DevChat Logo" 
            className="w-24 h-24 mx-auto mb-4 glow-purple rounded-2xl"
          />
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-vs-purple to-vs-glow bg-clip-text text-transparent">
            DevChat
          </h1>
          <p className="text-muted-foreground font-mono">
            Chat em tempo real com bots para desenvolvedores
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 rounded-lg bg-card border border-border">
            <MessageSquareCode className="w-8 h-8 text-vs-purple mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Comandos de Bot</h3>
            <p className="text-sm text-muted-foreground">
              /stock e muito mais
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-card border border-border">
            <Users className="w-8 h-8 text-vs-purple mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Salas Privadas</h3>
            <p className="text-sm text-muted-foreground">
              Crie ou entre em salas exclusivas
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-card border border-border">
            <Sparkles className="w-8 h-8 text-vs-purple mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Tema VS Code</h3>
            <p className="text-sm text-muted-foreground">
              Interface inspirada no Visual Studio
            </p>
          </div>
        </div>

        {/* CTA */}
        <Button 
          size="lg"
          onClick={() => setShowRoomForm(true)}
          className="w-full max-w-xs font-mono glow-purple"
        >
          Começar Chat
        </Button>
        
        <p className="text-xs text-muted-foreground mt-4 font-mono">
          v1.0 - Desenvolvido com ❤️ para devs
        </p>
      </div>
    </div>
  );
};

export default Lobby;