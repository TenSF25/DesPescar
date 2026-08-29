interface BookingStepsProps {
  pasoActual: 1 | 2 | 3;
}

export const BookingSteps = ({ pasoActual }: BookingStepsProps) => {
  const pasos = [
    { numero: 1, icono: 'bed' },
    { numero: 2, icono: 'person' },
    { numero: 3, icono: 'payments' },
  ];

  return (
    <div className="flex w-full max-w-125 flex-row items-center justify-between gap-3 text-white sm:gap-5">
      {pasos.map((paso, i) => (
        <div key={paso.numero} className="flex flex-1 items-center gap-3 last:flex-none">
          <div
            className={`flex items-center justify-center rounded-4xl p-2 ${
              paso.numero <= pasoActual ? 'bg-primary' : 'bg-black/20'
            }`}
          >
            <span className="material-symbols-outlined">{paso.icono}</span>
          </div>
          {i < pasos.length - 1 && (
            <hr
              className={`w-full border ${
                paso.numero < pasoActual ? 'text-primary' : 'text-black/20'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
