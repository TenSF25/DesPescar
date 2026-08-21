import { Outlet } from 'react-router-dom';
import { AccountSidebar } from './AccountSidebar';

export const AccountLayout = () => {
  return (
    <div className="mx-auto flex w-full max-w-312.5 flex-col gap-6 p-4 lg:flex-row lg:p-8">
      <AccountSidebar />
      <div className="w-full grow">
        <Outlet />
      </div>
    </div>
  );
};
