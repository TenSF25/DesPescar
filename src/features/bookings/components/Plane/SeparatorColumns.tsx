export const SeparatorColumns = () => {
  return (
    <div className="rows flex flex-row justify-between">
      <div className="rows-1 flex h-16 w-full items-center justify-between text-center font-medium text-[#636680]">
        <div className="bg-alert w-16 p-5">
          <h4>A</h4>
        </div>
        <div className="w-16 bg-amber-100 p-5">
          <h4>B</h4>
        </div>
        <div className="w-16 p-5">
          <h4>C</h4>
        </div>
      </div>
      <div className="min-w-16"></div>
      <div className="rows-2 flex h-16 w-full items-center justify-between text-center font-medium text-[#636680]">
        <div className="p-5">
          <h4>D</h4>
        </div>
        <div className="p-5">
          <h4>E</h4>
        </div>
        <div className="p-5">
          <h4>F</h4>
        </div>
      </div>
    </div>
  );
};
