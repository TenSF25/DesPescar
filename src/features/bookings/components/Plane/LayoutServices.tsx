import { Services } from './Services';

export const LayoutServices = () => {
  return (
    <div className="service flex w-full flex-row justify-between">
      <Services />
      <div className="min-w-16"></div>
      <Services />
    </div>
  );
};
