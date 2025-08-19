import { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Terminal } from 'lucide-react';
import { ChatInputProps } from '@/types/chat';
import { cn } from '@/lib/utils';

export const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isCommand = message.startsWith('@');

  const handleSubmit = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (value: string) => {
    setMessage(value);
    setIsTyping(value.length > 0);
  };

  const suggestions = ['/stock']

  return (
    <div className="border-t border-border bg-card">
      {/* Command suggestions */}
      {suggestions.length > 0 && (
        <div className="px-4 py-2 border-b border-border">
          <div className="flex gap-2 flex-wrap">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleInputChange(suggestion)}
                className="text-xs px-2 py-1 bg-vs-light text-vs-purple rounded hover:bg-vs-purple hover:text-white transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-end gap-3 p-4">
        {/* Command indicator */}
        {isCommand && (
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-vs-purple text-white">
            <Terminal size={16} />
          </div>
        )}

        {/* Input */}
        <div className="flex-1">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isCommand ? "Digite o comando..." : "Digite sua mensagem ou @comando..."}
            className={cn(
              "w-full resize-none rounded-lg px-4 py-3 min-h-[44px] max-h-32 input-vs",
              "placeholder:text-muted-foreground focus:outline-none font-mono",
              isCommand && "border-vs-purple glow-purple"
            )}
            rows={1}
            style={{
              height: 'auto',
              minHeight: '44px',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />
        </div>

        {/* Send button */}
        <Button
          onClick={handleSubmit}
          disabled={!message.trim()}
          size="lg"
          className={cn(
            "px-4 py-3 h-11",
            isCommand ? "bg-vs-purple hover:bg-vs-purple/80" : ""
          )}
        >
          <Send size={16} />
        </Button>
      </div>

      {/* Typing indicator */}
      {isTyping && (
        <div className="px-4 pb-2">
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-vs-purple animate-pulse"></div>
            {isCommand ? 'Processando comando...' : 'Digitando...'}
          </div>
        </div>
      )}
    </div>
  );
};