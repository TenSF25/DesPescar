import { useState } from 'react';
import { ReservationTabs, type ReservationTab } from '../components/ReservationTabs';
import { ProximosTab } from '../components/tabs/ProximosTab';
import { HistorialTab } from '../components/tabs/HistorialTab';
import { CanceladosTab } from '../components/tabs/CanceladosTab';

const tabContent: Record<ReservationTab, React.ReactNode> = {
  proximos: <ProximosTab />,
  historial: <HistorialTab />,
  cancelados: <CanceladosTab />,
};

export const MyReservationsPage = () => {
  const [activeTab, setActiveTab] = useState<ReservationTab>('proximos');

  return (
    <div className="flex flex-col">
      <div className="bg-secondary relative mb-6 flex min-h-32 flex-col justify-center overflow-hidden rounded-2xl px-6 py-8 sm:mb-8 sm:min-h-40 sm:px-11 sm:py-10">
        <div className="pointer-events-none absolute top-1/2 right-[-30px] h-85 w-85 -translate-y-1/2 rounded-full bg-white/3" />
        <div className="pointer-events-none absolute top-1/2 right-20 h-55 w-55 -translate-y-1/2 rounded-full bg-white/4" />
        <h1 className="relative z-10 mb-2 text-2xl font-extrabold text-white sm:text-3xl">
          Mis reservas
        </h1>
        <p className="relative z-10 text-sm font-medium text-white/65 sm:text-[15px]">
          Gestioná y consultá todas tus reservas.
        </p>
      </div>

      <ReservationTabs active={activeTab} onChange={setActiveTab} />

      {tabContent[activeTab]}
    </div>
  );
};
