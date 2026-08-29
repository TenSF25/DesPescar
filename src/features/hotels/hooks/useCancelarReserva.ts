import { useEffect, useMemo, useState } from 'react';
import type { MotivoCancelacion, ReservaHotel } from '../hotels.types';

export interface DesgloseReembolso {
  porcentaje: number; // 0, 50 o 100
  monto: number;
  etiqueta: string;
  clase: string;
}

const calcularReembolso = (fechaInicio: string, precioTotal: number): DesgloseReembolso => {
  const horasHastaCheckIn =
    (new Date(`${fechaInicio}T00:00:00`).getTime() - Date.now()) / (1000 * 60 * 60);

  if (horasHastaCheckIn > 48) {
    return {
      porcentaje: 100,
      monto: precioTotal,
      etiqueta: 'Cancelación Gratuita',
      clase: 'bg-green-50 text-green-700',
    };
  }
  if (horasHastaCheckIn >= 24) {
    return {
      porcentaje: 50,
      monto: precioTotal * 0.5,
      etiqueta: 'Cargo del 50%',
      clase: 'bg-orange-50 text-orange-700',
    };
  }
  return {
    porcentaje: 0,
    monto: 0,
    etiqueta: 'Cargo del 100%',
    clase: 'bg-red-50 text-alert',
  };
};

export const useCancelarReserva = (reservaId?: string) => {
  const [reservas, setReservas] = useState<ReservaHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [motivo, setMotivo] = useState<MotivoCancelacion | ''>('');
  const [comentario, setComentario] = useState('');
  const [entendido, setEntendido] = useState(false);
  const [isConfirmando, setIsConfirmando] = useState(false);
  const [isConfirmada, setIsConfirmada] = useState(false);

  useEffect(() => {
    fetch('/json/reservas-hotel.json')
      .then((res) => res.json())
      .then((datos: ReservaHotel[]) => setReservas(datos))
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }, []);

  const reserva = reservas.find((r) => String(r.id) === reservaId) ?? null;
  const yaCancelada = reserva?.estado === 'cancelado';
  const notFound = !loading && !reserva;

  const reembolso = useMemo(() => {
    if (!reserva) return null;
    return calcularReembolso(reserva.fechaInicio, reserva.precioTotal);
  }, [reserva]);

  const puedeConfirmar = motivo !== '' && entendido && !yaCancelada;

  const confirmarCancelacion = async () => {
    setIsConfirmando(true);
    // Sin backend todavía: simula la espera de una llamada real y confirma en la UI.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsConfirmando(false);
    setIsConfirmada(true);
  };

  return {
    loading,
    reserva,
    reembolso,
    notFound,
    yaCancelada,
    motivo,
    setMotivo,
    comentario,
    setComentario,
    entendido,
    setEntendido,
    puedeConfirmar,
    isConfirmando,
    isConfirmada,
    confirmarCancelacion,
  };
};
