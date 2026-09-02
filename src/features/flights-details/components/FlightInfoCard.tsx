export const FlightInfoCard = () => {
  return (
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
  );
};
