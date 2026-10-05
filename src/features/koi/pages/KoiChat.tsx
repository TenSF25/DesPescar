import React, { useState, useEffect, useRef } from 'react';
import { useKoiChat } from '../services/useKoiService';

interface CuteKoiIconProps {
  className?: string;
}

const CuteKoiIcon: React.FC<CuteKoiIconProps> = ({ className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 558 447" className={className}>
    <path
      fill="#FF6B35"
      d="M200 65.6c-8.5 4.8-19.5 10.7-24.5 13.2-16.2 8.1-34.6 18.3-39.8 21.9-41.1 28.7-58.8 64.7-49.9 101.3 6.1 25.1 27.1 59 51.2 82.8 20.3 20 38.2 32.2 79.5 54.2 5.5 3 13.6 7.3 18 9.7 4.4 2.4 12.4 6.4 17.8 9 5.3 2.5 9.7 5 9.7 5.4 0 2.1-15.3 10.4-27.5 15l-5.9 2.2 7.4 3.4c33.3 15.1 70.5 13.2 97.3-5.1 2.1-1.4 4.5-2.6 5.3-2.6.8 0 6.1-.9 11.7-2.1 19.1-3.9 41.6-12.5 53-20.3 2.1-1.4 4.2-2.6 4.7-2.6 1.9 0 19.1-18 23.1-24.3l4.3-6.8 1.4 2.6c1.6 3.2 1.8 13.6.2 16.6-1.8 3.3-.5 3.3 1.9.1 3.5-5 6-11.9 6.4-17.9.3-3.4 1.9-9.1 3.8-13.8 4.5-11 4.7-19.4.5-24.9-5.9-7.8-21.4-16.7-36.6-21-9.3-2.6-25.2-3.8-39.5-2.8-19.2 1.3-51.6 1.4-63 .2-36.2-3.8-78.3-14.1-93.5-22.7-18.4-10.5-33.3-30.8-34.9-47.6l-.6-6.7-4.5 2.2c-2.4 1.2-6.9 4.6-9.9 7.5-6.1 5.9-7.1 5.6-7.1-1.7 0-14.1 9.8-32.2 26.9-50l4.4-4.5-.6 6.7c-.4 3.7-1.3 8.1-2.2 9.8-2.7 5.2-.2 3.3 6.3-5 12.7-16 19.5-35.7 22.3-64 1.1-11.8.6-26-.9-26-.4.1-7.7 3.9-16.2 8.6zm15.3-1.2c-.2 1.7-.5 7.4-.7 12.6-.5 12.1-1.7 22-2.6 22-.4 0-.5 1.1-.2 2.5.2 1.4 0 2.5-.7 2.5-.5 0-.8.7-.5 1.5.8 1.9-.4 6.7-1.5 6.1-.4-.3-.8.1-.8.9s.3 1.2.7 1c.4-.3 0 1.6-.9 4-.9 2.5-2 4.5-2.4 4.5-.5 0-.5-.5-.1-1.2s.3-.8-.4-.4c-.8.5-.9 1.3-.2 2.5.7 1.4.4 2.1-1.5 3.1-1.3.7-2.2 1.7-1.9 2.2.3.5 1.2.1 2-.9 1.3-1.6 1.3-1.5.3.9-1 2.3-1.5 2.6-2.7 1.5-1.3-1-1.4-.9-.3 1 .7 1.5.8 2.3.1 2.3-.5 0-.9.3-.9.7.4 2.3-.3 3.5-1.5 3-1-.4-1.3-.1-.9.8.3.8 1 1.2 1.7.8.6-.4.5.1-.3 1-1.7 2.2-2 2.1-3.2-.6-.9-2.1-.9-2-.4.4.3 1.6-.1 3.1-.8 3.8-1.1.8-1.3.3-1.1-2.4.2-2.6-.2-3.8-1.9-5-1.2-.8-1.8-1.5-1.3-1.5s.3-.7-.5-1.6c-1.1-1.3-.8-1.9 1.6-4 1.7-1.5 2.3-2.4 1.4-2.4-2.1 0-25.8 21.7-31.9 29.2-2.8 3.5-6.6 9.4-8.6 13.3-18 36.6 11.1 67.4 81.1 85.5 18.4 4.7 37.8 8.4 55 10.5 7.2.8 15.3 1.8 18 2.2 2.8.4 25.9.7 51.5.8 44.9.1 46.7.2 53.5 2.3 15.9 5 27.9 12 31.6 18.5 2 3.6 2 4.4 1 10-2 10.3-1.8 10.1-5.8 5.6-4.3-4.7-6.4-5.2-2.9-.6 2.4 3.1 5.6 12.9 5.6 16.9 0 2.6-1.7 2.2-2.3-.5-.7-2.6-6.5-10.7-7.8-10.7-.5 0-.5 1 0 2.3 1.1 2.7-.8 8.9-3.6 12-7.7 8.7-13.6 13.4-21.8 17.5-3.3 1.7-8.2 3.4-11 3.7-5.8.8-17.2-1.5-22.2-4.5-1.8-1.1-3.3-1.6-3.3-1.1 0 1.7 8.6 7.9 13 9.4l4.5 1.6-6.3.1c-7.6 0-12.1-2-18.5-8.5-7.8-7.8-9.5-18.7-4.4-28.5 2.1-4 2.3-4.9 1-3.9-4.1 3.2-7.6 9.2-9.3 16.1-2.3 9 3.5 20.8 13 26.3l4.8 2.8-7 2.5c-3.8 1.3-7.2 2.1-7.5 1.9-.3-.3.2-1.6 1.1-2.9 2.1-2.9 2-4.5-.3-5.7-1.5-.9-2.4-.2-5.6 4.5-7.6 11-20.5 21-34.5 26.7-17.2 7.1-40.8 7.4-61.7 1l-5.1-1.6 8.7-4.3c5-2.6 13.9-8.5 21.1-14.2 19.2-15.1 24-17.4 39.5-19.3 10.8-1.3 16.4-3.8 21.6-9.8 2.2-2.4 3.9-4.2 3.9-4 0 .2-.4 1.9-1 3.8-.5 1.9-.7 3.1-.3 2.8 1-1.1 3.2 2.6 3.3 5.5 0 1.9.5 2.8 1.6 2.8s.8.9-1.3 3.7c-1.5 2.1-3.9 4.9-5.2 6.3-1.4 1.4-1.8 1.6-1 .6 1.3-1.8 1.3-1.8-.8-.6-1.2.8-2 1.7-1.8 2 .6 1-5.8 3.7-7.9 3.4-1.9-.3-10 4.5-9.2 5.4.9.8 9.6-1.8 14.7-4.4 5.8-2.9 13.9-10.3 13.9-12.7 0-.9.5-1.7 1-1.7.6 0 1 .4 1 1 0 .5.8 1 1.8 1 1.5-.1 1.6-.2.1-1.3-3-2.3-6.1-9.6-5.4-12.9.5-2.1.4-2.8-.4-2.4-.6.4-1.1 1.4-1.1 2.2 0 .8-.4 1.4-.9 1.4s-.8-2.1-.6-4.8c.4-4 1-5.2 4.5-8.2 4.4-3.8 4.7-4.5 2.6-5.3-1.1-.4-1.3-.1-1 1.1.4 1.1-.2.8-1.6-.8-2-2.3-2.1-2.3-1-.2 1.2 2.4.5 4.6-1.1 3.7-.5-.4-1.2.1-1.5.9-.3.9-1.1 1.6-1.6 1.6-.6 0-.8-.6-.5-1.3.3-.8-.1-1.4-.9-1.4-1.2 0-1.1.5.2 2.5 1.6 2.4 1.5 2.6-.2 3.9-5.4 4.1-13 6.8-26.2 9.4-15.3 3-24 6.3-31 11.7-4.3 3.2-4.4 3.3-9 2-4-1.2-4.7-1.8-5-4.2-.2-1.7-1.9-4.3-4.3-6.6-2.9-2.7-3.9-4.5-3.9-6.8 0-4 4.2-8.9 9.4-11.2 2.3-.9 6.1-3.4 8.6-5.5 4.3-3.6 4.5-3.7 10-2.9 12 1.8 18.1-.2 18.8-6 .5-3.6-1.1-5.3-5.8-6.1-8.3-1.4-12-9.3-6.2-13.3 1.5-1.1 3.8-2.2 5.2-2.3 2.1-.3 2.6-1 2.8-4 .3-3.1-.2-4-3.2-6.2-4-3.1-9.4-3.5-14.9-1.2-5.8 2.4-9.9 1.9-15.3-1.9-10.9-7.7-11.8-8-24.2-7.9l-11.3.2-3.7-3.3c-5.9-5.2-8.4-6.6-11.9-6.6-2.5 0-3.1.3-2.6 1.5.3.9 1.3 1.5 2.2 1.3 2.4-.4 8.2 2.3 7.4 3.5-.3.5-.1.7.4.4 1-.6 7.5 4.7 6.8 5.5-.2.2 1.3.3 3.2.4 1.9 0 3.9.7 4.5 1.5.8 1.1.9 1 .4-.4-.4-1.4-.1-1.6 1.9-1.3 1.3.3 2.9-.2 3.6-1 .6-.8 2.1-1.4 3.2-1.4 1.9 0 1.8.3-1.1 2.7-3.1 2.7-3.2 3.1-3.7 12.5-.6 10.6-.7 10.4 7.8 17.5 1.9 1.7 2.7 3.2 2.7 5.5-.1 6.6-5.7 10.8-14.6 10.8-8.7 0-10.9 1.9-10.9 9.5 0 7.5-1.6 8.7-7.6 5.9-28.2-12.9-48-24.2-61.4-34.9-10.9-8.7-23.3-21.1-30.5-30.5-1.9-2.5-3.7-4.7-4-5-.7-.7-8.1-12-10.2-15.5-1-1.7-4-7.6-6.8-13.3-5.3-10.8-6.5-17.7-3.6-20.1 1-.8 1.3-2.3.9-4.7-.5-3.2-.4-3.4 2.6-4 4.7-1 6.5-5.1 5.7-13.1-.4-3.8-.2-8.8.5-12.2 1.2-5.7 1.2-6-1.4-9.1-3.2-3.8-3.4-6.3-.7-11.5 1.2-2.3 2-5.9 2-8.8 0-4.8 1.5-7.7 4.1-7.7.7 0 .9-.3.6-.7-.4-.3.1-1.2 1.1-2 1.1-.9 1.1-1.2.2-.7-1.2.5-1.2.4-.3-.6 1.3-1.4 3.7-.4 2.7 1.2-.4.7-.2.8.5.4.9-.6.9-1.1.1-2.1-.9-1.1-.7-1.9.9-3.6 1.2-1.3 2.1-2.1 2.2-1.8.5 2.5.4 4.7-.1 4.4-.3-.2-.6.5-.6 1.5s.4 1.6.8 1.4c.4-.3 1.3.4 2 1.6.7 1.1 2 2 2.8 2 1.3 0 1.3.1 0 1-1.2.8-1.1 1 .8 1 1.2 0 2.2.4 2.2 1 0 1.8-3.7 7-4.5 6.2-.4-.4-.4.4 0 1.7.5 1.6.4 2.1-.4 1.7-.7-.5-1.2.3-1.3 2.1-.4 8.3-.4 9.1.8 8.6.6-.2 1.4.3 1.7 1.1.4 1 .1 1.3-.7 1-.8-.3-1.6-.1-2 .4-.3.5.8.8 2.3.7 2.2-.1 2.8.2 2.3 1.3-.3 1-.1 1.3.6.8 2.8-1.7 4.2 9.4 2.7 19.9-.5 3.2-1.1 4.1-2.7 4.2-2.1.2-6.6-4.3-6-6 .1-.5-.3-.5-.9-.1-.7.4-1.8-.1-2.6-1.1-1.2-1.8-1.3-1.8-1.3-.1 0 1.6-.2 1.7-1.7.5s-1.6-1.2-1 .3c.4 1.1.2 1.7-.5 1.5-.6-.1-1.5 1.4-2 3.3-.4 1.9-1 4.3-1.3 5.2-.2 1 0 2 .4 2.3.5.2 1.2 2.6 1.5 5.2.4 2.7 1.4 7.3 2.3 10.3.9 3 1.7 8.7 1.7 12.6.1 6.5.4 7.6 3.3 11.1 2.5 3.2 3.1 4.9 3.1 8.6 0 5.4.5 6.2 9.5 15.6 3.7 3.9 6.7 7.5 6.7 8 0 2.3 7.7 9.9 11.8 11.6 2.9 1.3 3.8 1.2 7.5-.2 3.9-1.6 4-1.7 1.7-2.3-1.4-.4-2.9-.3-3.5.1-1.7 1.3-6.6.5-6-.9.3-.7 0-1-.5-.7-1 .6-3.9-1.6-4.3-3.2-.1-.4-.7-.7-1.4-.5-.8.2-1-.3-.6-1.4.5-1.2.3-1.5-.6-.9-1 .5-1.1.2-.7-1.2.4-1.2.1-2.5-.9-3.3-.8-.7-1.5-.9-1.5-.5s-1.1-.4-2.5-2c-2.5-2.6-2.5-2.8-1-5.2 1.6-2.4 1.6-2.4-.7-.9-1.7 1.1-2.7 1.2-3.8.5-1.2-.9-1.2-1 .3-.5 1.1.4 1.6.2 1.2-.5-.4-.6-1.3-.8-2-.5-.8.3-2.1-.6-2.9-1.9-1.7-2.6-2.1-3.9-.8-3.1.4.2.8-.4.8-1.5 0-1.8-.2-1.8-1.2-.5-1.7 2.3-2.4.9-2.4-4.9 0-3.7-.5-5.7-2-7.3-1.1-1.2-2-2.6-2-3.2 0-.5-.5-1-1.1-1-.6 0-.9-.7-.5-1.5.3-.8.1-1.5-.5-1.5s-.7-.5-.4-1c.3-.6.3-1.6-.2-2.3-.9-1.4-1.5-4.7-.9-4.7.3 0 1.7 2.6 3.3 5.7 2.6 5.4 8.7 12 25.6 28.1 3.2 3 6.8 7.7 8.3 10.8 2.8 5.8 9.5 13.4 11.8 13.4 2.1 0 4.4 3.2 7 9.5 3.1 7.7 6.5 11.8 12.1 14.5 6.6 3.2 13.6 2.5 19.8-1.9 8.5-6.1 15.6-5.2 25.5 3.3 4.1 3.5 6.2 4.6 8.8 4.6 3.4 0 4.9-1.9 1.7-2.2-4.1-.3-8.4-1.9-7.8-2.8.3-.4-.5-1-1.8-1.4-1.7-.5-1.9-.8-.8-1.5.9-.6 1-1.1.2-1.5-.6-.4-1.1-.2-1.1.4 0 .6-.5.8-1 .5-.6-.4-.8-1.1-.5-1.6.4-.5.3-.9-.2-1-2.9-.2-4.7-.9-5.3-2-.5-.6-3-1.1-6.1-1.1-6.7 0-7.8.3-10.1 2.5-1.9 1.8-4.3 2.4-3.3.8.3-.5.1-1.2-.4-1.5-.5-.4-.8.5-.7 1.8.3 2.1-.3 2.6-3.5 3.4-6.4 1.6-11.9.4-16.9-3.8-1.4-1.2-1.8-1.9-1-1.5.8.4.5-.2-.7-1.2s-3.4-4.4-4.9-7.6c-1.4-3.2-3.4-6.1-4.3-6.5-1-.4 0-.9 2.9-1.4 2.5-.3 5.7-1 7.2-1.3 2.1-.6 3.9 0 7.5 2.3 5.6 3.6 9.3 4.7 12.8 3.8 5.7-1.4 5.1-7.7-1-11-3.1-1.7-5.5-5.2-5.5-8.1 0-2.2 2.9-4.5 5.8-4.5 3.8 0 7.2-2.6 7.2-5.5 0-5.1-10.1-9.7-18-8.1-4.4.8-7.5-.7-15-7.7-4.3-4-8.4-6.8-11.2-7.7-5.1-1.7-8-3.3-13.2-7.7-2.2-1.8-4.6-3.3-5.5-3.3-.8 0-3.2-1.7-5.3-3.7l-3.8-3.7-2.4 2.3c-1.7 1.6-3.1 2.1-4.5 1.6-3.4-1.1-10.7-9.3-13.9-15.8-2.8-5.4-3.1-6.7-2.3-10.1 1.7-6.9 5.5-7.5 9.4-1.4 2 3.2 5 5 6.9 4.3 2.1-.8 3.7-6.1 4.2-14.1.6-8.8-.7-13.4-5.1-18-1.8-2-3.3-4.3-3.3-5.3 0-2.5 2-8.1 3-8.1 1.3 0 3.2-5.6 2.8-8.6-.2-2.2-1.1-3.3-3.5-4.3-1.8-.8-3.5-2.2-3.8-3.2-.7-2.2 2.6-9 7.2-14.7 1.9-2.3 3.1-4.2 2.7-4.2-1.7 0-11.9 8.8-17.6 15.1-11.1 12.4-17.8 24.2-21.3 37.4-2.3 8.8-2.9 24.8-1.2 31.5l1.5 5.5-.2-9c-.1-5 .1-10.2.5-11.8.5-1.6.4-2.7-.2-2.7-.6 0-.7-.5-.3-1.2.4-.7.8-2.1.9-3.2.4-5.1 1.8-11.7 2.6-12.2.5-.3.9-1.6.9-3 0-1.3.5-2.4 1-2.4.6 0 1-.6.9-1.3-.3-2.4.1-3.8 1-3.3.5.3 1.1-.7 1.5-2.2.7-3.4 2.3-5.9 3.2-5 .7.8-2.3 9-3.6 9.8-1.1.7 1.6 9.1 3.4 10.5 1.9 1.5 2.4 3.8 1.4 5.9-1.6 3-2 10.1-.9 14.1 1.3 4.9-.2 9-4 10.5-3.2 1.4-5.4 4.4-4.4 6.1.4.5.4 1.7 0 2.7-.5 1.4-.7 1.4-1.6.2-.8-1.2-.9-1.1-.5.5.3 1.1.1 3.7-.4 5.9-.7 3.3-.4 4.8 2.1 10.3 2.5 5.5 2.8 6.8 1.7 8.2-1.2 1.4-1.1 1.5.4.2 1.6-1.2 1.9-1 2.8 1.3.5 1.5 1.3 3.8 1.6 5.1.3 1.4 1.1 2.5 1.7 2.5.6 0 .8.3.4.6-.3.4.1 1.3.9 2.2 2.1 2.1-.4 3.7-2.7 1.6-.8-.7-2.1-1.4-2.7-1.4-1.6 0-2.4-1.8-1.1-2.6.8-.4.9-.3.5.4s-.2 1.2.4 1.2c.7 0 1-.5.8-1.1-.2-.6-.6-.9-.9-.7-.9.5-3.9-2.3-3.4-3.2.3-.4-.2-1-1-1.4-.8-.3-1.5-1-1.5-1.6 0-.6.6-.8 1.3-.5.6.4.1-.3-1.3-1.5-1.6-1.4-1.9-2-.8-1.6 1.3.4 1.5.1 1.1-1.1-.5-1.2-.3-1.4.7-.8.9.5 1.1.4.6-.4-.4-.6-1.3-.8-1.9-.4-2.6 1.6-3."
    />
  </svg>
);

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

        /* El chiste del mareo */
        @keyframes dizzy-spin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(0.8); }
          100% { transform: rotate(360deg) scale(1); }
        }
        
        .koi-dizzy {
          animation: dizzy-spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
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
        className={`koi-fab group fixed right-4 bottom-4 z-50 flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 focus:outline-none sm:right-6 sm:bottom-6 sm:h-24 sm:w-24 ${
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
            <CuteKoiIcon className="koi-swim group-hover:koi-swim-fast h-full w-full transition-all" />
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
        className={`koi-panel fixed right-4 bottom-28 flex h-[min(34.375rem,calc(100dvh-8rem))] w-[min(23.75rem,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 sm:right-6 sm:bottom-32 ${
          isOpen ? 'scale-100 opacity-100' : 'pointer-events-none scale-0 opacity-0'
        }`}
      >
        <div className="flex items-center justify-between bg-linear-to-r from-blue-800 to-blue-500 px-5 py-4 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={pokeKoi}
              title="No me toques la pecera"
              className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-white/40 bg-white/20 shadow-inner transition-transform hover:bg-white/30"
            >
              <CuteKoiIcon
                className={`h-10 w-10 translate-y-1 ${isDizzy ? 'koi-dizzy' : 'koi-swim'}`}
              />
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
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
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
