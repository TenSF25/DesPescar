import { useEffect, useState } from 'react';
import { cn } from '../../../utils/cn';
import type { ChatMessage } from '../chatbot.types';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { ChatMessageList } from './ChatMessageList';

interface ChatWindowProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onClose: () => void;
  onSend: (text: string) => void;
}

export const ChatWindow = ({ messages, isTyping, onClose, onSend }: ChatWindowProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      role="dialog"
      aria-label="Chat con KOI AI"
      className={cn(
        'fixed right-6 bottom-38 z-50 flex h-[70vh] max-h-130 w-[90vw] max-w-90 flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl transition-all duration-200 ease-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
      )}
    >
      <ChatHeader onClose={onClose} />
      <ChatMessageList messages={messages} isTyping={isTyping} />
      <ChatInput onSend={onSend} disabled={isTyping} />
    </div>
  );
};
