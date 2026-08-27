import { useEffect, useRef, useState, type FormEvent } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled = false }: ChatInputProps) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.trim() || disabled) return;

    onSend(value);
    setValue('');
    inputRef.current?.focus();
  };

  // El input se deshabilita mientras KOI "está escribiendo", y al deshabilitarse
  // el navegador le saca el foco. Apenas vuelve a habilitarse, se lo devolvemos.
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-black/10 p-3">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Escribí tu consulta..."
        disabled={disabled}
        className="focus:border-primary w-full flex-1 rounded-full border border-black/20 px-4 py-2 text-sm outline-none disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Enviar mensaje"
        className="bg-primary flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span className="material-symbols-outlined text-lg">send</span>
      </button>
    </form>
  );
};
