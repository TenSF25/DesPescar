import { Link } from 'react-router-dom';

const STEPS = [
  { to: '/results', label: 'Buscar nuevos vuelos', icon: 'search' },
  { to: '/cuenta/reservas', label: 'Ver mis reservas', icon: 'confirmation_number' },
  { to: '/cuenta/ajustes', label: 'Contactar soporte', icon: 'headset_mic' },
];

export const NextStepsAside = () => {
  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-4 rounded-2xl border border-black/10 p-5">
        <h2 className="text-secondary flex flex-row items-center gap-2 font-bold">
          <span className="material-symbols-outlined" aria-hidden="true">
            help
          </span>
          ¿Qué sigue ahora?
        </h2>
        <p className="text-neutral text-[14px]">
          Explorá otras opciones y encontrá el vuelo que mejor se adapte a tu viaje.
        </p>

        <ul className="flex flex-col gap-3">
          {STEPS.map((step) => (
            <li key={step.to}>
              <Link
                to={step.to}
                className="text-secondary flex flex-row items-center gap-3 rounded-[10px] border border-black/10 p-3 text-[14px] font-semibold transition-colors duration-200 hover:bg-black/5"
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  {step.icon}
                </span>
                {step.label}
                <span className="material-symbols-outlined ml-auto" aria-hidden="true">
                  chevron_right
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-row gap-3 rounded-2xl bg-[#fff8ec] p-5">
        <span className="material-symbols-outlined text-primary" aria-hidden="true">
          shield
        </span>
        <div className="flex flex-col gap-1 text-[14px]">
          <h3 className="text-secondary font-semibold">Reservá con tranquilidad</h3>
          <p className="text-neutral">
            Podés cambiar o cancelar tu reserva según las condiciones de tu tarifa.
          </p>
          <Link to="/cuenta/ajustes" className="text-primary underline underline-offset-4">
            Ver políticas
          </Link>
        </div>
      </section>
    </div>
  );
};
