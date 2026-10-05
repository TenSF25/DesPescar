import { describe, expect, it } from 'vitest';
import type { KoiConversationResponse, KoiMensajeHistorial, KoiOpcion } from './koi.types';
import {
  CLAVE_ABIERTO,
  CLAVE_SESION,
  debeReabrirChat,
  guardarSessionId,
  leerSessionId,
  marcarChatAbierto,
  mensajeDeErrorKoi,
  mensajeDeRespuesta,
  mensajesDesdeHistorial,
  olvidarSessionId,
} from './koiSesion';

const almacenFalso = () => {
  const datos = new Map<string, string>();
  return {
    datos,
    getItem: (k: string) => datos.get(k) ?? null,
    setItem: (k: string, v: string) => void datos.set(k, v),
    removeItem: (k: string) => void datos.delete(k),
  };
};

const opcion: KoiOpcion = {
  optionId: 'op-1',
  tipo: 'HOTEL',
  hotel: {
    hotelId: 'h1',
    hotelNombre: 'Llao Llao',
    ciudad: 'San Carlos de Bariloche',
    estrellas: 5,
    imagen: 'https://img/1',
    tipoHabitacionId: 't1',
    tipoHabitacionNombre: 'Doble',
    checkIn: '2026-11-19',
    checkOut: '2026-11-22',
    noches: 3,
    cantidadHabitaciones: 1,
    huespedes: 2,
    precio: 960000,
  },
  viajeros: 2,
  total: 960000,
  moneda: 'ARS',
  motivo: '5★ en San Carlos de Bariloche por 3 noches, 1 habitación.',
};

describe('sessionId de KOI', () => {
  it('se guarda, se lee y se olvida', () => {
    const almacen = almacenFalso();
    expect(leerSessionId(almacen)).toBeNull();
    guardarSessionId('abc', almacen);
    expect(almacen.datos.get(CLAVE_SESION)).toBe('abc');
    expect(leerSessionId(almacen)).toBe('abc');
    olvidarSessionId(almacen);
    expect(leerSessionId(almacen)).toBeNull();
  });

  it('sin sessionStorage (tests, SSR o modo privado bloqueado) no rompe', () => {
    expect(leerSessionId(null)).toBeNull();
    expect(() => guardarSessionId('abc', null)).not.toThrow();
    expect(debeReabrirChat(null)).toBe(false);
  });

  it('la marca de reabrir el chat se consume una sola vez', () => {
    const almacen = almacenFalso();
    expect(debeReabrirChat(almacen)).toBe(false);
    marcarChatAbierto(almacen);
    expect(almacen.datos.get(CLAVE_ABIERTO)).toBe('1');
    expect(debeReabrirChat(almacen)).toBe(true);
    expect(debeReabrirChat(almacen)).toBe(false);
  });
});

describe('mensajes del chat', () => {
  it('traduce el historial del servidor conservando las opciones de cada mensaje de KOI', () => {
    expect(
      mensajesDesdeHistorial([
        { rol: 'KOI', texto: '¡Hola!', opciones: [] },
        { rol: 'USER', texto: 'Hotel en Bariloche', opciones: [] },
        { rol: 'KOI', texto: 'Te armé 1 opción', opciones: [opcion] },
      ]),
    ).toEqual([
      { role: 'bot', text: '¡Hola!', opciones: [] },
      { role: 'user', text: 'Hotel en Bariloche', opciones: [] },
      { role: 'bot', text: 'Te armé 1 opción', opciones: [opcion] },
    ]);
  });

  it('tolera opciones ausentes en el historial', () => {
    expect(
      mensajesDesdeHistorial([{ rol: 'KOI', texto: 'hola' } as unknown as KoiMensajeHistorial]),
    ).toEqual([{ role: 'bot', text: 'hola', opciones: [] }]);
  });

  it('arma el mensaje de KOI desde la respuesta', () => {
    const respuesta: KoiConversationResponse = {
      sessionId: 's',
      reply: 'Te armé 1 opción',
      needsMoreInfo: false,
      nextQuestion: null,
      missingFields: [],
      intent: 'SOLO_HOTEL',
      stage: 'RECOMMENDING',
      recommendations: [opcion],
    };
    expect(mensajeDeRespuesta(respuesta)).toEqual({
      role: 'bot',
      text: 'Te armé 1 opción',
      opciones: [opcion],
    });
  });

  it('elige un texto amable según el error', () => {
    expect(mensajeDeErrorKoi(429)).toMatch(/muy rápido/);
    expect(mensajeDeErrorKoi(504)).toMatch(/tardé demasiado/);
    expect(mensajeDeErrorKoi(undefined)).toMatch(/repetirlo/);
  });
});
