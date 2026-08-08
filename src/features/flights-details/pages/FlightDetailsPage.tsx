export const FlightDetailsPage = () => {
  return (
    <div>
      <header></header>

      <div className="flex">
        <aside className="w-64 border-r bg-white p-6">
          <div className="flex flex-col gap-4">
            <div className="rounded-lg px-4 py-3">Dashboard</div>

            <div className="rounded-lg px-4 py-3">Mis reservas</div>

            <div className="rounded-lg px-4 py-3">Mis datos</div>

            <div className="rounded-lg px-4 py-3">Ajustes</div>
          </div>

          <hr className="my-6" />

          <div className="px-4 py-3">Cerrar sesión</div>
        </aside>

        <main className="flex-1 p-8">
          <p>← Volver a mis reservas</p>

          {/* TARJETA SUPERIOR */}
          <div className="mt-6 rounded-xl border p-6">
            <div className="flex items-center gap-6">
              <div>PRÓXIMO VIAJE</div>

              <div>
                <div className="font-bold">BUE</div>
                <div className="text-sm text-gray-500">Buenos Aires</div>
              </div>

              <div>✈</div>

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
                <div className="font-bold">PRÓXIMO</div>
              </div>

              <button className="rounded-lg border px-4 py-2">Descargar comprobante</button>
            </div>
          </div>

          {/* INFORMACIÓN DEL VUELO */}
          <div className="mt-6 rounded-xl border p-6">
            <h2 className="text-xl font-bold">Información del vuelo</h2>

            <div className="mt-6 flex items-center gap-8">
              <div>
                <div className="font-bold">BUE</div>
                <div className="text-sm text-gray-500">Buenos Aires</div>

                <div className="mt-4 font-bold">10:30</div>
                <div className="text-sm text-gray-500">15 de octubre 2026</div>
              </div>

              <div>✈</div>

              <hr className="my-4" />

              <div className="flex gap-8">
                <div>
                  <div className="text-sm text-gray-500">Vuelo</div>
                  <div className="font-bold">DSC2456</div>
                </div>

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
                <div>
                  <div className="font-bold">MEX</div>
                  <div className="text-sm text-gray-500">México</div>

                  <div className="mt-4 font-bold">16:55</div>
                  <div className="text-sm text-gray-500">15 de octubre 2026</div>
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
