import { cn } from '@/utils/cn';
import LogoDespescar from '/despescar.webp';
import type { HTMLAttributes } from 'react';

interface LayoutAuthProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const LayoutAuth = ({ className, children }: LayoutAuthProps) => {
  return (
    <div className="grid w-full grid-cols-2 overflow-hidden">
      <section
        className={cn(
          'bg-secondary flex flex-1 flex-col items-center justify-center text-white',
          className,
        )}
      >
        <img src={LogoDespescar} alt="" className="max-w-150" />
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-5xl font-extrabold">Vuela Diferente</h2>
          <div className="flex flex-col items-center justify-center">
            <p className="text-xl">Conoce el mundo con nosotros.</p>
            <p className="text-xl">Tu próxima aventura comienza aca.</p>
          </div>
          <p>✈️ 🌐 📚</p>
        </div>
      </section>
      <section className="flex items-center justify-center">{children}</section>
    </div>
  );
};
