import React, { useState, useEffect, useRef } from 'react';
import { useKoiChat } from '../services/useKoiService';
import KoiAvatar from '../components/KoiAvatar';
import { KoiOpcionCard } from '../components/KoiOpcionCard';

export default function KoiChat() {
  const { messages, sendMessage, loading, isReady } = useKoiChat();
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isDizzy, setIsDizzy] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input);
    setInput('');
  };

  const pokeKoi = () => {
    if (!isDizzy) {
      setIsDizzy(true);
      setTimeout(() => setIsDizzy(false), 1000);
    }
  };

  return (
    <>
      <style>{`
        @keyframes koi-swim-animation {
          0% { transform: translateY(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(-6px) rotate(-3deg) scale(1.02); }
          50% { transform: translateY(-12px) rotate(0deg) scale(1); }
          75% { transform: translateY(-4px) rotate(3deg) scale(0.98); }
          100% { transform: translateY(0px) rotate(0deg) scale(1); }
        }

        /* Animación para cuando pasas el mouse por el botón (nada más rápido) */
        .koi-swim-fast {
          animation: koi-swim-animation 1.5s ease-in-out infinite !important;
        }

        @keyframes bubble-rise-1 {
          0% { transform: translateY(0px) translateX(0px) scale(0.4); opacity: 0; }
          20% { opacity: 0.9; }
          100% { transform: translateY(-55px) translateX(-12px) scale(1.4); opacity: 0; }
        }
        @keyframes bubble-rise-2 {
          0% { transform: translateY(0px) translateX(0px) scale(0.3); opacity: 0; }
          30% { opacity: 0.7; }
          100% { transform: translateY(-45px) translateX(10px) scale(1.2); opacity: 0; }
        }
        @keyframes bubble-rise-3 {
          0% { transform: translateY(0px) translateX(0px) scale(0.5); opacity: 0; }
          15% { opacity: 0.8; }
          100% { transform: translateY(-65px) translateX(-5px) scale(1.6); opacity: 0; }
        }

        .koi-swim {
          animation: koi-swim-animation 3.5s ease-in-out infinite;
          filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.3));
          transform-origin: center;
        }

        .bubble {
          position: absolute;
          border-radius: 50%;
        }
        .bubble-1 { top: 8px; left: 18px; width: 7px; height: 7px; background: radial-gradient(circle at 30% 30%, rgba(255,255,255,1), rgba(255,255,255,0.6)); box-shadow: inset -1px -1px 2px rgba(0,0,0,0.1); animation: bubble-rise-1 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .bubble-2 { top: 18px; left: 26px; width: 5px; height: 5px; background: radial-gradient(circle at 30% 30%, rgba(255,255,255,1), rgba(255,255,255,0.5)); animation: bubble-rise-2 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.6s; }
        .bubble-3 { top: 2px; left: 12px; width: 9px; height: 9px; background: radial-gradient(circle at 30% 30%, rgba(255,255,255,1), rgba(255,255,255,0.7)); animation: bubble-rise-3 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite 1.2s; }
        
        /* Simula reflejo de agua en la burbuja principal */
        .fish-bowl {
          box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.5), 0 10px 25px rgba(37, 99, 235, 0.4);
        }
      `}</style>

      <button
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? 'Cerrar ventana' : '¡Haz blup para hablar con KOI!'}
        className={`koi-fab group fixed right-6 bottom-6 z-[500] flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 focus:outline-none ${
          isOpen
            ? 'right-10! h-16! w-16! bg-red-500 shadow-2xl hover:bg-red-600'
            : 'fish-bowl border-2 border-white/40 bg-linear-to-br from-blue-100 via-blue-200 to-blue-400 backdrop-blur-sm'
        }`}
      >
        {isOpen ? (
          <svg
            className="h-6 w-6 rotate-90 text-white transition-transform duration-300 group-hover:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <div className="relative flex h-full w-full items-center justify-center p-3">
            <img
              src="/koi/koi.webp"
              alt=""
              className="koi-swim group-hover:koi-swim-fast h-full w-full object-contain transition-all"
            />
            <div className="bubble bubble-1" />
            <div className="bubble bubble-2" />
            <div className="bubble bubble-3" />
            <span className="absolute -top-10 right-0 scale-0 rounded-xl bg-white px-3 py-1 text-xs font-bold text-blue-600 shadow-md transition-transform group-hover:scale-100">
              ¡Blup blup! 🐟
            </span>
          </div>
        )}
      </button>

      <div
        className={`fixed right-4 bottom-32 left-4 z-[500] flex h-137.5 max-h-[calc(100dvh-9rem)] w-auto origin-bottom-right flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 sm:right-6 sm:left-auto sm:w-95 ${
          isOpen ? 'scale-100 opacity-100' : 'pointer-events-none scale-0 opacity-0'
        }`}
      >
        <div className="flex items-center justify-between bg-linear-to-r from-blue-800 to-blue-500 px-5 py-4 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={pokeKoi}
              title="No me toques la pecera"
              className="flex h-[4.5rem] w-[4.5rem] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-white/40 bg-white/20 shadow-inner transition-transform hover:bg-white/30"
            >
              <KoiAvatar working={loading} dizzy={isDizzy} />
            </button>
            <div>
              <h3 className="flex items-center gap-2 text-base font-bold tracking-wide">
                KOI AI{' '}
                {isDizzy && (
                  <span className="rounded bg-yellow-400 px-1 text-[10px] text-black">
                    ¡Mareado! 😵‍💫
                  </span>
                )}
              </h3>
              <p className="text-xs text-blue-100">Agente de DesPescar</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-blue-100 transition-colors hover:rotate-90 hover:text-white focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent space-y-4 overflow-y-auto bg-slate-50 p-4">
          {!isReady && (
            <div className="flex justify-center py-4">
              <span className="animate-pulse text-sm text-gray-500">
                Buceando en el mar de ofertas... 🤿🫧
              </span>
            </div>
          )}

          {messages.length === 0 && isReady && !loading && (
            <div className="flex justify-center py-8 text-center opacity-60">
              <p className="text-sm text-gray-500">
                ¡Hola! Soy KOI. <br />
                ¿A qué océano volamos hoy?
              </p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex w-full flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 text-[14px] leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'rounded-2xl rounded-br-none bg-blue-600 text-white'
                    : 'rounded-2xl rounded-bl-none border border-gray-100 bg-white whitespace-pre-wrap text-gray-800'
                }`}
              >
                {msg.text}
              </div>
              {msg.opciones.length > 0 && (
                <div className="flex w-full flex-col gap-3">
                  {msg.opciones.map((opcion) => (
                    <KoiOpcionCard key={opcion.optionId} opcion={opcion} />
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-none border border-gray-100 bg-white px-4 py-3 shadow-sm">
                <div className="flex gap-1.5">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-blue-400" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t bg-white p-3">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tirame una línea... 🎣"
              disabled={!isReady || loading}
              className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm transition-colors outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!isReady || loading || !input.trim()}
              className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-all hover:scale-105 hover:bg-blue-700 focus:outline-none disabled:cursor-not-allowed disabled:bg-blue-300 disabled:hover:scale-100"
            >
              <svg
                className="h-5 w-5 -translate-x-px translate-y-px group-hover:animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
