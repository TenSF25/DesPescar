import { Outlet } from 'react-router';
import { Footer } from './Footer';

export const FooterLayout = () => {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
};
