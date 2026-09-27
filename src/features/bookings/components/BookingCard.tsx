import { Button } from '@/components/ui/Button';
import { useCard } from '../hooks/useCard';

export interface Content {
  name: string;
  icon?: string;
}

export interface BookingCard {
  title: string;
  option: number;
  description?: string;
  content: Content[];
  button: string;
}

export const BookingCard = ({ title, option, description, content, button }: BookingCard) => {
  const { handlerClick } = useCard();
  return (
    <div className="border-secondary flex flex-col rounded-lg border">
      <div className="flex flex-col border-b p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">{title}</h3>
          <Button
            variant="secondary"
            className="w-max rounded-full border-none"
            onClick={() => handlerClick(option)}
          >
            {button}
          </Button>
        </div>
        <p className="text-xs">{description}</p>
      </div>
      <div className="flex flex-wrap gap-3 px-5 py-4">
        {content.map((cont) => (
          <div className="flex w-90 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20">
              <span className="material-symbols-outlined text-white">{cont.icon}</span>
            </div>
            <h5 className="font-semibold">{cont.name}</h5>
          </div>
        ))}
      </div>
    </div>
  );
};
