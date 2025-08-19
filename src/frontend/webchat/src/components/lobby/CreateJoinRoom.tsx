import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarCreator, AvatarData } from '@/components/avatar/AvatarCreator';
import { ArrowLeft, Plus, LogIn, Users, Hash } from 'lucide-react';
import { generateGuid } from '@/utils/guid';

interface CreateJoinRoomProps {
  onRoomJoin: (data: { roomId: string; userName: string; isCreating: boolean; avatarUrl: string; avatarData: AvatarData }) => void;
  onBack: () => void;
}

export const CreateJoinRoom = ({ onRoomJoin, onBack }: CreateJoinRoomProps) => {
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarData, setAvatarData] = useState<AvatarData | null>(null);
  const [step, setStep] = useState<'avatar' | 'room'>('avatar');

  const generateRoomId = () => {
    return generateGuid();
  };

  const handleCreateRoom = async () => {
    if (!userName.trim() || !avatarData) return;
    
    setIsLoading(true);
    const newRoomId = generateRoomId();
    
    // Simular delay de criação
    setTimeout(() => {
      onRoomJoin({ 
        roomId: newRoomId, 
        userName: userName.trim(), 
        isCreating: true,
        avatarUrl,
        avatarData
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleJoinRoom = async () => {
    if (!userName.trim() || !roomId.trim() || !avatarData) return;
    
    setIsLoading(true);
    
    // Simular validação da sala
    setTimeout(() => {
      onRoomJoin({ 
        roomId: roomId.trim(), 
        userName: userName.trim(), 
        isCreating: false,
        avatarUrl,
        avatarData
      });
      setIsLoading(false);
    }, 800);
  };

  const handleAvatarChange = (url: string, data: AvatarData) => {
    setAvatarUrl(url);
    setAvatarData(data);
  };

  const handleContinueToRoom = () => {
    if (avatarData) {
      setStep('room');
    }
  };

  const handleBackToAvatar = () => {
    setStep('avatar');
  };

  if (step === 'avatar') {
    return (
      <Card className="w-full bg-card border-border">
        <CardHeader className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="absolute left-4 top-4 p-2"
          >
            <ArrowLeft size={16} />
          </Button>
          
          <CardTitle className="text-vs-purple font-mono">Criar seu Avatar</CardTitle>
          <CardDescription>
            Personalize seu avatar antes de entrar no chat
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <AvatarCreator onAvatarChange={handleAvatarChange} />
          
          <Button
            onClick={handleContinueToRoom}
            disabled={!avatarData}
            className="w-full font-mono"
            size="lg"
          >
            Continuar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-card border-border">
      <CardHeader className="text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToAvatar}
          className="absolute left-4 top-4 p-2"
        >
          <ArrowLeft size={16} />
        </Button>
        
        <div className="flex items-center justify-center gap-3 mb-2">
          <img src={avatarUrl} alt="Seu avatar" className="w-8 h-8 rounded-full" />
          <CardTitle className="text-vs-purple font-mono">Entrar no DevChat</CardTitle>
        </div>
        <CardDescription>
          Crie uma nova sala ou entre em uma existente
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Nome do usuário */}
        <div className="mb-6">
          <Label htmlFor="userName" className="font-mono">
            Seu nome de usuário
          </Label>
          <Input
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Desenvolvedor123"
            className="input-vs font-mono mt-1"
            maxLength={20}
          />
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create" className="font-mono">
              <Plus size={16} className="mr-2" />
              Criar Sala
            </TabsTrigger>
            <TabsTrigger value="join" className="font-mono">
              <LogIn size={16} className="mr-2" />
              Entrar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-4">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-vs-light border border-vs-purple/30">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={16} className="text-vs-purple" />
                  <span className="font-mono text-sm">Nova Sala Privada</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Uma sala será criada automaticamente com ID único
                </p>
              </div>
              
              <Button
                onClick={handleCreateRoom}
                disabled={!userName.trim() || isLoading || !avatarData}
                className="w-full font-mono"
                size="lg"
              >
                {isLoading ? 'Criando...' : 'Criar Sala'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="join" className="mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="roomId" className="font-mono">
                  ID da Sala
                </Label>
                <div className="relative mt-1">
                  <Hash size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="roomId"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="00000000-0000-0000-0000-000000000001"
                    className="input-vs font-mono pl-10"
                    maxLength={36}
                  />
                </div>
              </div>
              
              <Button
                onClick={handleJoinRoom}
                disabled={!userName.trim() || !roomId.trim() || isLoading || !avatarData}
                className="w-full font-mono"
                size="lg"
              >
                {isLoading ? 'Entrando...' : 'Entrar na Sala'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-3 rounded-lg bg-muted">
          <p className="text-xs text-muted-foreground font-mono">
            💡 <strong>Dica:</strong> Compartilhe o ID da sala com outros desenvolvedores para conversarem juntos!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};