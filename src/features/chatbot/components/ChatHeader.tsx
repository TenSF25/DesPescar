interface ChatHeaderProps {
  onClose: () => void;
}

export const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  return (
    <div className="bg-secondary flex items-center justify-between gap-2 rounded-t-2xl px-4 py-3">
      <div className="flex items-center gap-3">
        <img
          src="/koi-ai.png"
          alt="KOI AI"
          className="h-9 w-9 rounded-full bg-white object-cover"
        />
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-white">KOI AI</span>
          <span className="flex items-center gap-1 text-xs text-white/70">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Asistente de viajes
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar chat"
        className="cursor-pointer text-white/80 hover:text-white"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
};
