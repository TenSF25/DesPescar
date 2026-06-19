import { useState } from 'react';

export const useNav = () => {
  const [isOpen, setOpen] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);
  const open = () => setOpen(true);

  return {
    isOpen,
    toggleMenu,
    close,
    open,
  };
};
