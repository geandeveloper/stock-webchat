import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Dice6 } from 'lucide-react';

interface AvatarCreatorProps {
  onAvatarChange: (avatarUrl: string, avatarData: AvatarData) => void;
  initialAvatar?: AvatarData;
}

export interface AvatarData {
  style: string;
  seed: string;
  backgroundColor: string;
  accessories: string[];
}

const AVATAR_STYLES = [
  { id: 'adventurer', name: 'Aventureiro' },
  { id: 'avataaars', name: 'Avataaars' },
  { id: 'big-smile', name: 'Grande Sorriso' },
  { id: 'bottts', name: 'Robôs' },
  { id: 'personas', name: 'Personas' },
  { id: 'pixel-art', name: 'Pixel Art' },
];

const BACKGROUND_COLORS = [
  { id: 'b6e3f4', name: 'Azul Claro', color: '#b6e3f4' },
  { id: 'c0aede', name: 'Roxo Claro', color: '#c0aede' },
  { id: 'ffd5dc', name: 'Rosa Claro', color: '#ffd5dc' },
  { id: 'ffdfba', name: 'Laranja Claro', color: '#ffdfba' },
  { id: 'c7ceea', name: 'Lilás', color: '#c7ceea' },
  { id: 'ffb3ba', name: 'Rosa', color: '#ffb3ba' },
];

export const AvatarCreator = ({ onAvatarChange, initialAvatar }: AvatarCreatorProps) => {
  const [avatarData, setAvatarData] = useState<AvatarData>(
    initialAvatar || {
      style: 'adventurer',
      seed: Math.random().toString(36).substring(7),
      backgroundColor: 'b6e3f4',
      accessories: [],
    }
  );

  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateAvatarUrl = (data: AvatarData) => {
    const baseUrl = 'https://api.dicebear.com/7.x';
    const params = new URLSearchParams({
      seed: data.seed,
      backgroundColor: data.backgroundColor,
      format: 'svg',
    });

    return `${baseUrl}/${data.style}/svg?${params.toString()}`;
  };

  const updateAvatar = (newData: Partial<AvatarData>) => {
    const updated = { ...avatarData, ...newData };
    setAvatarData(updated);
    
    const url = generateAvatarUrl(updated);
    setAvatarUrl(url);
    onAvatarChange(url, updated);
  };

  const randomizeAvatar = () => {
    setIsLoading(true);
    const randomSeed = Math.random().toString(36).substring(7);
    const randomStyle = AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)].id;
    const randomBg = BACKGROUND_COLORS[Math.floor(Math.random() * BACKGROUND_COLORS.length)].id;
    
    setTimeout(() => {
      updateAvatar({
        seed: randomSeed,
        style: randomStyle,
        backgroundColor: randomBg,
      });
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    const url = generateAvatarUrl(avatarData);
    setAvatarUrl(url);
    onAvatarChange(url, avatarData);
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center font-mono text-vs-purple">
          Criar Avatar
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Avatar Preview */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div 
              className="w-24 h-24 rounded-full border-2 border-vs-purple overflow-hidden glow-purple"
              style={{ backgroundColor: `#${avatarData.backgroundColor}` }}
            >
              {avatarUrl && !isLoading ? (
                <img 
                  src={avatarUrl} 
                  alt="Seu avatar" 
                  className="w-full h-full object-cover"
                  onError={() => console.error('Erro ao carregar avatar')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <RefreshCw className={`w-8 h-8 text-vs-purple ${isLoading ? 'animate-spin' : ''}`} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Style Selection */}
        <div className="space-y-2">
          <Label className="font-mono">Estilo do Avatar</Label>
          <Select
            value={avatarData.style}
            onValueChange={(value) => updateAvatar({ style: value })}
          >
            <SelectTrigger className="input-vs font-mono">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AVATAR_STYLES.map((style) => (
                <SelectItem key={style.id} value={style.id} className="font-mono">
                  {style.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Background Color */}
        <div className="space-y-2">
          <Label className="font-mono">Cor de Fundo</Label>
          <div className="grid grid-cols-3 gap-2">
            {BACKGROUND_COLORS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => updateAvatar({ backgroundColor: bg.id })}
                className={`p-2 rounded-lg border-2 transition-all ${
                  avatarData.backgroundColor === bg.id
                    ? 'border-vs-purple'
                    : 'border-border hover:border-vs-purple/50'
                }`}
                style={{ backgroundColor: bg.color }}
              >
                <div className="text-xs font-mono text-gray-800">
                  {bg.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Random Button */}
        <Button
          onClick={randomizeAvatar}
          disabled={isLoading}
          variant="outline"
          className="w-full font-mono"
        >
          <Dice6 className="w-4 h-4 mr-2" />
          {isLoading ? 'Gerando...' : 'Avatar Aleatório'}
        </Button>

        <div className="text-xs text-muted-foreground text-center font-mono">
          Powered by DiceBear API
        </div>
      </CardContent>
    </Card>
  );
};