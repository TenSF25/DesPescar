import { useState } from 'react';
import { CardResume } from './CardResume';
import { SeparatorCard } from './SeparatorCard';

// Interfaces para el tipado estricto de los datos
interface DetailRow {
  name: string;
  value: string;
}

interface AccordionItem {
  id: string;
  icon: string;
  label: string;
  price: string;
  details: DetailRow[];
}

export const Resume = () => {
  // Estado para rastrear qué ID de botón está abierto (string o null si todos están cerrados)
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const footerItems: AccordionItem[] = [
    {
      id: 'passengers',
      icon: 'person',
      label: '1 Pasajero',
      price: '$47.108',
      details: [
        { name: 'Tarifa Base (Adulto)', value: '$38.200' },
        { name: 'Equipaje de mano (10kg)', value: 'Incluido' },
        { name: 'Equipaje de bodega (23kg)', value: '$8.908' },
      ],
    },
    {
      id: 'seats',
      icon: 'seat_window',
      label: 'Asientos',
      price: '$31.900',
      details: [
        { name: 'Asiento Ida (4A - Ventana)', value: '$15.950' },
        { name: 'Asiento Vuelta (12C - Pasillo)', value: '$15.950' },
      ],
    },
    {
      id: 'taxes',
      icon: 'percent',
      label: 'Tasas e impuestos',
      price: '$47.108',
      details: [
        { name: 'Tasa aeroportuaria de salida', value: '$18.400' },
        { name: 'Impuesto de seguridad comercial', value: '$9.200' },
        { name: 'Cargos gubernamentales e IVA', value: '$19.508' },
      ],
    },
  ];

  // Función para manejar la apertura exclusiva
  const handleToggle = (id: string) => {
    // Si haces clic en el que ya está abierto, se cierra. Si no, se abre el nuevo y cierra el anterior.
    setOpenItemId(openItemId === id ? null : id);
  };

  return (
    <section className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-black/14 bg-white shadow-xl shadow-gray-100/50">
      {/* Componentes modulares de vuelos */}
      <CardResume variant="ida" origen="Buenos Aires" destino="México" />

      <SeparatorCard />

      <CardResume variant="vuelta" origen="MÉXICO" destino="Buenos Aires" />

      {/* Bloque de colapsables (Acordeón) */}
      <div className="flex flex-col">
        {footerItems.map((item) => {
          const isOpen = openItemId === item.id;

          return (
            <div key={item.id} className="border-t border-black/8 bg-gray-100">
              {/* Botón Disparador */}
              <button
                onClick={() => handleToggle(item.id)}
                className="flex w-full items-center justify-between px-5 py-4 transition-colors hover:bg-gray-200/50 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full text-white">
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-extrabold text-gray-900">{item.price}</span>
                  {/* Microinteracción: La flecha rota 180 grados si está abierto */}
                  <span
                    className={`material-symbols-outlined text-primary transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  >
                    keyboard_arrow_down
                  </span>
                </div>
              </button>

              {/* Contenedor Desplegable con animación fluida de Tailwind */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'pointer-events-none grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  {/* Contenido interno del desglose */}
                  <div className="flex flex-col gap-3 border-t border-black/5 bg-white/60 px-6 py-4">
                    {item.details.map((detail, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span className="font-medium text-gray-500">{detail.name}</span>
                        <span className="font-bold text-gray-800">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
