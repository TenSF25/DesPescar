import { AirplaneCanvas } from '../components/Plane2/AirplaneCanvas';

import { Resume } from '../components/reservations/Resume';

export const SeatSelectionPage = () => {
  return (
    <div className="mx-auto min-h-screen w-full">
      <AirplaneCanvas></AirplaneCanvas>

      <section className="fixed top-50 right-30 z-30 w-md">
        <Resume />
      </section>
    </div>
  );
};
