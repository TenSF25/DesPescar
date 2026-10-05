import { cn } from '@/utils/cn';
import LogoDespescar from '/despescar.webp';
import type { HTMLAttributes } from 'react';

interface LayoutAuthProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const LayoutAuth = ({ className, children }: LayoutAuthProps) => {
  return (
    <div className="grid w-full grid-cols-1 overflow-hidden lg:grid-cols-2">
      <section
        className={cn(
          'bg-secondary flex flex-1 flex-col items-center justify-center px-4 py-8 text-center text-white',
          className,
        )}
      >
        <img src={LogoDespescar} alt="" className="hidden max-w-150 lg:block" />
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">Vuela Diferente</h2>
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg sm:text-xl">Conoce el mundo con nosotros.</p>
            <p className="text-lg sm:text-xl">Tu próxima aventura comienza aca.</p>
          </div>
          <p>✈️ 🌐 📚</p>
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-10">{children}</section>
    </div>
  );
};
