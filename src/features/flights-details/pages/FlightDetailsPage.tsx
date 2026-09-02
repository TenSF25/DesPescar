import { HelpCard } from '../components/HelpCard';
import { PaymentSummaryCard } from '../components/PaymentSummaryCard';
import { PassengersCard } from '../components/PassengersCard';
import { FlightInfoCard } from '../components/FlightInfoCard';
import { TripSummaryCard } from '../components/TripSummaryCard';
import { Sidebar } from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
export const FlightDetailsPage = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    const content = `
    COMPROBANTE DE RESERVA
    
    Reserva: ABC123
    Ruta: BUE - MEX
    Fecha: 15 de octubre de 2026
    Horario: 10:30 - 16:55
    Pasajeros: Juan Diaz, Azul Yedro
    Total: $1.200,00
    `;

    const archivo = new Blob([content], { type: 'text/plain' });

    const url = URL.createObjectURL(archivo);

    const link = document.createElement('a');

    link.href = url;

    link.download = 'comprobante-reserva.txt';

    link.click();

    URL.revokeObjectURL(url);
  };

  const handleSupport = () => {
    window.location.href = 'mailto:soporte@despescar.com';
  };

  return (
    <div>
      <header></header>

      <div className="flex">
        <Sidebar />

        <main className="flex-1 bg-gray-50 p-8">
          <div className="mx-auto max-w-6xl">
            <button
              onClick={() => navigate('/booking/reservation')}
              className="flex items-center gap-2 font-medium text-blue-950"
            >
              <span>←</span>
              <span>Volver a mis reservas</span>
            </button>
            {/* TARJETA SUPERIOR */}
            <TripSummaryCard onDownload={handleDownload} />

            {/* DOS COLUMNAS */}
            <div className="mt-6 flex flex-col gap-6 xl:flex-row">
              {' '}
              {/* COLUMNA IZQUIERDA */}
              <div className="min-w-0 flex-1">
                {' '}
                {/* INFORMACIÓN DEL VUELO */}
                <FlightInfoCard />
                {/* PASAJEROS */}
                <PassengersCard />
              </div>
              {/* COLUMNA DERECHA */}
              <div className="w-full xl:w-96">
                {' '}
                <PaymentSummaryCard />
                <HelpCard onSupport={handleSupport} />
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer></footer>
    </div>
  );
};
