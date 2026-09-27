import { Search } from '@/components/ui/Search';
import { useEffect } from 'react';

export const ModifySearch = ({ onClose }: { onClose: () => void }) => {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.touchAction = 'none';

    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
      body.style.touchAction = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 top-0 left-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="bg-secondary relative flex w-full max-w-150 flex-col gap-3 rounded-3xl border p-8">
        <div className="flex justify-between text-white">
          <h2 className="text-xl font-bold text-white">Modificar tu busqueda</h2>
          <span
            className="material-symbols-outlined hover:text-alert cursor-pointer"
            onClick={onClose}
          >
            close
          </span>
        </div>
        <Search moodle={true} onClose={onClose} />
      </div>
    </div>
  );
};
