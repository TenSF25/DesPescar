import { cn } from '../../../utils/cn';
import type { ChatMessage } from '../chatbot.types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export const ChatMessageBubble = ({ message }: ChatMessageBubbleProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line',
          isUser
            ? 'bg-primary rounded-br-sm text-white'
            : 'bg-secondary/5 text-secondary rounded-bl-sm',
        )}
      >
        {message.text}
      </div>
    </div>
  );
};
