import { Link } from 'react-router-dom';

const links = [
  { label: 'Vuelos', icon: 'flight' },
  { label: 'Inspiraciones', icon: 'explore' },
  { label: 'Ofertas', icon: 'local_offer' },
  { label: 'Soporte', icon: 'support_agent' },
];

export const TopNav = () => {
  return (
    <header className="fixed top-0 right-0 left-0 z-100 flex h-15 items-center border-b border-black/10 bg-white px-8">
      <Link to="/" className="w-66 shrink-0">
        <h3 className="text-secondary text-2xl font-bold tracking-widest">DESPESCAR</h3>
      </Link>

      <nav className="flex flex-1 items-center justify-evenly">
        {links.map(({ label, icon }) => (
          <a
            key={label}
            href="#"
            className="text-neutral hover:text-primary flex items-center gap-1.5 text-sm font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]!">{icon}</span>
            {label}
          </a>
        ))}
      </nav>

      <div className="flex shrink-0 items-center gap-5">
        <button
          type="button"
          aria-label="Notificaciones"
          className="text-neutral hover:text-secondary cursor-pointer"
        >
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold tracking-wide text-white">
          JG
        </div>
      </div>
    </header>
  );
};
