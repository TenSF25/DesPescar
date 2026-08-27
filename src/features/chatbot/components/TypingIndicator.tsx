export const TypingIndicator = () => {
  return (
    <div className="bg-secondary/5 flex w-fit items-center gap-1 rounded-2xl rounded-bl-sm px-3 py-2">
      <span className="bg-secondary/40 h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.3s]" />
      <span className="bg-secondary/40 h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.15s]" />
      <span className="bg-secondary/40 h-1.5 w-1.5 animate-bounce rounded-full" />
    </div>
  );
};
