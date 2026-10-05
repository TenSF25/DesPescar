import { Search } from '@/components/ui/Search';
import { useEffect, type ReactNode } from 'react';
import { useSearchParams } from 'react-router';

export const ModifySearch = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children?: ReactNode;
}) => {
  const [searchParams] = useSearchParams();

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
    // El scroll (si la pantalla es baja) lo hace el fondo: si la tarjeta tuviera overflow, cortaría el desplegable.
    <div className="fixed inset-0 z-500 overflow-y-auto bg-black/30 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="bg-secondary relative flex w-full max-w-150 flex-col gap-3 rounded-3xl border p-4 sm:p-8">
          <div className="flex justify-between text-white">
            <h2 className="text-xl font-bold text-white">Modificar tu búsqueda</h2>
            <span
              className="material-symbols-outlined hover:text-alert cursor-pointer"
              onClick={onClose}
            >
              close
            </span>
          </div>
          {children ?? (
            <Search
              moodle={true}
              onClose={onClose}
              initialValues={{
                origin: searchParams.get('origin') ?? undefined,
                destination: searchParams.get('destination') ?? undefined,
                passengers: Number(searchParams.get('passengers')) || 1,
                departureDate: searchParams.get('departureDate') ?? undefined,
                returnDate: searchParams.get('returnDate') ?? undefined,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
