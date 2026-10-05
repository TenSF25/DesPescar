import { useNavigate } from 'react-router';

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate('/my-reservations')}
      className="text-secondary mb-3 flex min-h-10 cursor-pointer items-center gap-1.5 text-sm font-bold hover:opacity-70"
    >
      <span className="material-symbols-outlined text-[18px]!">arrow_back</span>
      Volver a Mis reservas
    </button>
  );
};
