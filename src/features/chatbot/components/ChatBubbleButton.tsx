import { cn } from '../../../utils/cn';

interface ChatBubbleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const ChatBubbleButton = ({ isOpen, onClick }: ChatBubbleButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? 'Cerrar chat de KOI AI' : 'Abrir chat de KOI AI'}
      aria-expanded={isOpen}
      className={cn(
        'border-secondary/10 fixed right-6 bottom-6 z-50 flex h-30 w-30 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 bg-white shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95',
      )}
    >
      {isOpen ? (
        <span className="material-symbols-outlined text-secondary text-3xl">close</span>
      ) : (
        <img src="/koi-ai.png" alt="KOI AI" className="h-full w-full object-cover" />
      )}
    </button>
  );
};
