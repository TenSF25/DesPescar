export const Steps = () => {
  return (
    <div className="flex w-200 flex-row items-center justify-between gap-5 text-white">
      <div className="bg-primary flex items-center justify-center rounded-4xl p-2">
        <span className="material-symbols-outlined">flight_takeoff</span>
      </div>
      <hr className="text-primary w-full border" />
      <div className="bg-primary flex items-center justify-center rounded-4xl p-2">
        <span className="material-symbols-outlined">chair</span>
      </div>
      <hr className="text-primary w-full border" />
      <div className="bg-primary flex items-center justify-center rounded-4xl p-2">
        <span className="material-symbols-outlined">payments</span>
      </div>
    </div>
  );
};
