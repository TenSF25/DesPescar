export const PassengersCard = () => {
  return (
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
  );
};
