import { Outlet } from 'react-router-dom';
import { Steps } from '../components/Steps';

export const BookingLayout = () => {
  return (
    <main className="mt-10 mr-auto mb-10 ml-auto flex w-full max-w-312.5 flex-col items-center justify-center gap-20">
      <div className="mt-20">
        <Steps />
      </div>
      <div className="">
        <Outlet />
      </div>
    </main>
  );
};
