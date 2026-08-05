import type { HTMLAttributes } from 'react';

export const Section = ({ children }: HTMLAttributes<HTMLElement>) => {
  return <section className="mx-auto w-full max-w-400">{children}</section>;
};
