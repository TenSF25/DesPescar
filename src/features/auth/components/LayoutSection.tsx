import React from 'react';
import { cn } from '../../../utils/cn';
import LogoDespescar from '/despescar.webp';
import type { HTMLAttributes } from 'react';

interface Layout extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const LayoutSection = ({ children, className }: Layout) => {
  return (
    <div className={cn('flex h-screen w-full flex-row justify-between', className)}>
      <section className="bg-secondary flex h-full w-full flex-col items-center justify-center gap-3 text-white">
        <img src={LogoDespescar} alt="" className="h-auto w-125" />
        <h3 className="text-[40px] font-bold">Vuela diferente</h3>
        <p className="w-75 text-center text-[18px] font-normal">
          Conoce el mundo con nosotros. Tu próxima aventura comienza aquí.
        </p>
        <h6>✈️ 🌐 📚</h6>
      </section>
      <section className="flex h-full w-full items-center justify-center">{children}</section>
    </div>
  );
};
