export const SeparatorCard = () => {
  return (
    <div className="relative flex items-center bg-gray-100/30 py-2">
      <div className="absolute -left-2.5 h-5 w-5 rounded-full border-r border-black/60 bg-gray-50"></div>
      <div className="mx-4 w-full border-t border-dashed border-black/50"></div>
      <div className="absolute -right-2.5 h-5 w-5 rounded-full border-l border-black/60 bg-gray-50"></div>
    </div>
  );
};
