import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTicket,
  faTableColumns,
  faUser,
  faGear,
  faRightFromBracket,
  faDownload,
  faPlane,
  faHeadset,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
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
        <aside className="w-64 border-r bg-white p-6">
          <div className="flex flex-col gap-4">
            <div className="gap-3- flex items-center rounded-lg px-4 py-3">
              <FontAwesomeIcon icon={faTableColumns} className="w-4" />
              <span>Dashboard</span>
            </div>
            <button
              onClick={() => navigate('/booking/reservation')}
              className="flex items-center gap-3 rounded-lg bg-orange-500 px-4 py-3 text-white"
            >
              <span>
                <FontAwesomeIcon icon={faTicket} className="w-4" />
              </span>
              <span>Mis reservas</span>
            </button>
            <div className="rounded-lg px-4 py-3">
              <FontAwesomeIcon icon={faUser} className="w-4" />
              <span>Mis datos</span>
            </div>
            <div className="rounded-lg px-4 py-3">
              <FontAwesomeIcon icon={faGear} className="w-4" />
              <span>Ajustes</span>
            </div>
          </div>

          <hr className="my-6" />

          <div className="flex items-center gap-3 px-4 py-3 text-red-500">
            <FontAwesomeIcon icon={faRightFromBracket} className="w-4" />
            <span>Cerrar sesión</span>
          </div>
        </aside>

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
            <div className="mt-6 rounded-xl border bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="rounded-md bg-blue-950 px-3 py-2 text-sm font-bold text-white">
                  PRÓXIMO VIAJE
                </div>

                <div>
                  <div className="font-bold">BUE</div>
                  <div className="text-sm text-gray-500">Buenos Aires</div>
                </div>

                <FontAwesomeIcon icon={faPlane} className="w-4 text-blue-950" />

                <div>
                  <div className="font-bold">MEX</div>
                  <div className="text-sm text-gray-500">México</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Código de reserva</div>
                  <div className="font-bold">ABC123</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Estado</div>
                  <div className="inline-block rounded-md bg-green-100 px-2 py-1 text-sm font-bold text-green-700">
                    PRÓXIMO
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 rounded-lg border border-blue-950 px-5 py-3 font-semibold text-blue-950"
                >
                  <FontAwesomeIcon icon={faDownload} className="w-4" />
                  <span>Descargar comprobante</span>
                </button>
              </div>
            </div>

            {/* DOS COLUMNAS */}
            <div className="mt-6 flex gap-6">
              {/* COLUMNA IZQUIERDA */}
              <div className="flex-1">
                {/* INFORMACIÓN DEL VUELO */}
                <div className="rounded-xl border bg-white p-6">
                  <h2 className="text-xl font-bold">Información del vuelo</h2>

                  <div className="mt-6 flex items-center gap-8">
                    <div>
                      <div className="font-bold">BUE</div>

                      <div className="text-sm text-gray-500">Buenos Aires</div>

                      <div className="mt-4 font-bold">10:30</div>

                      <div className="text-sm text-gray-500">15 de octubre 2026</div>
                    </div>

                    <div>✈</div>

                    <div>
                      <div className="font-bold">MEX</div>

                      <div className="text-sm text-gray-500">México</div>

                      <div className="mt-4 font-bold">16:55</div>

                      <div className="text-sm text-gray-500">15 de octubre 2026</div>
                    </div>
                  </div>

                  <hr className="my-6" />

                  <div className="grid grid-cols-5 gap-6">
                    <div>
                      <div className="text-sm text-gray-500">Vuelo</div>

                      <div className="font-bold">DSC2456</div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">Tarifa</div>

                      <div className="font-bold">Flex</div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">Avión</div>

                      <div className="font-bold">Boeing 787-9</div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">Duración</div>

                      <div className="font-bold">12h 25m</div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">Escalas</div>

                      <div className="font-bold">Directo</div>
                    </div>
                  </div>
                </div>

                {/* PASAJEROS */}
                <div className="mt-6 rounded-xl border bg-white p-6">
                  <h2 className="text-xl font-bold">Pasajeros</h2>

                  <div className="mt-4 flex justify-between">
                    <div className="font-medium">Juan Diaz</div>
                    <div className="font-bold">2C</div>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <div className="font-medium">Azul Yedro</div>
                    <div className="font-bold">2D</div>
                  </div>

                  <h3 className="mt-5 font-bold">Asientos</h3>
                  <div className="mt-3 flex gap-4">
                    <div className="rounded-lg border bg-amber-50 px-4 py-3">2C Juan Diaz</div>

                    <div className="rounded-lg border bg-gray-50 px-4 py-3">2D Azul Yedro</div>
                  </div>
                </div>
              </div>

              {/* COLUMNA DERECHA */}
              <div className="w-96">
                <div className="rounded-xl border bg-white p-6">
                  <h2 className="text-xl font-bold">Resumen de pago</h2>

                  <div className="mt-6 flex justify-between">
                    <div>Tarifa (2 pasajeros)</div>
                    <div>$1.200,00</div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>Asientos</div>
                    <div>$0,00</div>
                  </div>
                  <hr className="my-6" />

                  <div className="flex justify-between font-bold">
                    <div>Total</div>
                    <div className="text-orange-500">$1.200,00</div>
                  </div>
                  <div className="mt-6 rounded-lg bg-orange-50 p-4">
                    <div className="flex items-center gap-2 font-bold">
                      <FontAwesomeIcon icon={faShieldHalved} className="w-4 text-orange-500" />
                      <span>Reservá con tranquilidad</span>
                    </div>

                    <p className="mt-2 text-sm text-gray-600">
                      Podés cambiar o cancelar tu reserva según las condiciones de tu tarifa.
                    </p>
                  </div>
                </div>
                <div className="mt-6 rounded-xl border bg-white p-6">
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faHeadset} className="w-5 text-blue-950" />

                    <h2 className="text-xl font-bold">¿Necesitás ayuda?</h2>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    Estamos para asistirte en lo que necesites.
                  </p>

                  <button
                    onClick={handleSupport}
                    className="mt-5 flex items-center gap-2 rounded-lg border border-blue-950 px-5 py-3 font-medium text-blue-950"
                  >
                    <FontAwesomeIcon icon={faHeadset} className="w-4" />
                    <span>Contactar soporte</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer></footer>
    </div>
  );
};
