import { useCallback, useEffect, useRef, useState } from 'react';
import type { ErrorApi } from '@/features/cart/cart.types';
import { useAuthStore } from '@/store/useAuthStore';
import {
  cambiosGrupo,
  debeConsultarGrupo,
  ESPERA_CONSULTA_GRUPO_MS,
  leerErrorGrupo,
} from '../grupo';
import type { FuenteGrupo, Grupo } from '../grupo.types';
import { consultarGrupo, obtenerGrupo, participacion } from '../services/grupoService';

const leer = (fuente: FuenteGrupo): Promise<Grupo> => {
  switch (fuente.tipo) {
    case 'organizador':
      return obtenerGrupo(fuente.reservaId);
    case 'participacion':
      return participacion(fuente.reservaId);
    default:
      return consultarGrupo(fuente.token);
  }
};

const clave = (f: FuenteGrupo | null, userId: number | undefined) =>
  `${f === null ? '' : f.tipo === 'token' ? `token:${f.token}` : `${f.tipo}:${f.reservaId}`}|${userId ?? ''}`;

interface Vista {
  /** Fuente y usuario a los que pertenece lo leído. */
  clave: string;
  grupo: Grupo | null;
  /** Momento (ms) de la última lectura: el contador del plazo descuenta desde acá. */
  leidoEn: number;
  cargando: boolean;
  error: ErrorApi | null;
}

const vacia = (clave: string, fuente: FuenteGrupo | null): Vista => ({
  clave,
  grupo: null,
  leidoEn: Date.now(),
  cargando: fuente !== null,
  error: null,
});

/**
 * El grupo de una fuente: se lee al montar y cada 15 s mientras está ABIERTO o COMPLETO y la
 * pestaña es visible (D-b19). Los cambios entre lecturas se anuncian (alguien se sumó, pagó, se
 * confirmó...). Las respuestas que llegan después de cambiar de fuente o de usuario se descartan.
 * Las páginas memorizan `fuente` para que no cambie de identidad en cada render.
 */
export const useGrupo = (fuente: FuenteGrupo | null) => {
  const userId = useAuthStore((s) => s.user?.id);
  const claveActual = clave(fuente, userId);
  const [vista, setVista] = useState<Vista>(() => vacia(claveActual, fuente));
  const [anuncio, setAnuncio] = useState('');
  const [intento, setIntento] = useState(0);
  const previo = useRef<Grupo | null>(null);

  // Cambio de fuente o de usuario: se olvida lo anterior (ajuste de estado durante el render).
  if (vista.clave !== claveActual) setVista(vacia(claveActual, fuente));

  const aplicar = useCallback((g: Grupo) => {
    const ahora = Date.now();
    setVista((v) => ({ ...v, grupo: g, leidoEn: ahora, error: null }));
  }, []);

  // Avisos para la región viva: se comparan dos lecturas seguidas de la misma fuente.
  useEffect(() => {
    const g = vista.grupo;
    if (!g) {
      previo.current = null;
      return;
    }
    const textos = cambiosGrupo(previo.current, g);
    previo.current = g;
    if (textos.length === 0) return;
    // Se vacía primero para que un texto repetido se vuelva a anunciar.
    window.setTimeout(() => setAnuncio(''), 0);
    window.setTimeout(() => setAnuncio(textos.join(' ')), 50);
  }, [vista.grupo]);

  useEffect(() => {
    if (!fuente) return;
    let timer: number | undefined;
    let activo = true;
    const programar = (estado: Grupo['estado']) => {
      if (!debeConsultarGrupo(estado, document.visibilityState === 'visible')) return;
      timer = window.setTimeout(() => setIntento((n) => n + 1), ESPERA_CONSULTA_GRUPO_MS);
    };
    const cargar = async () => {
      try {
        const leido = await leer(fuente);
        if (!activo) return;
        aplicar(leido);
        programar(leido.estado);
      } catch (err: unknown) {
        if (!activo) return;
        const error = leerErrorGrupo(err, 'No pudimos cargar el pago en grupo.');
        setVista((v) => ({ ...v, error }));
        // Un error pasajero no corta el seguimiento de un grupo que ya se veía abierto.
        if (previo.current) programar(previo.current.estado);
      } finally {
        if (activo) setVista((v) => (v.cargando ? { ...v, cargando: false } : v));
      }
    };
    void cargar();
    return () => {
      activo = false;
      window.clearTimeout(timer);
    };
  }, [fuente, claveActual, intento, aplicar]);

  // Al volver a la pestaña se consulta enseguida (la espera se había cortado al ocultarse).
  useEffect(() => {
    const alCambiar = () => {
      if (
        document.visibilityState === 'visible' &&
        previo.current &&
        debeConsultarGrupo(previo.current.estado, true)
      ) {
        setIntento((n) => n + 1);
      }
    };
    document.addEventListener('visibilitychange', alCambiar);
    return () => document.removeEventListener('visibilitychange', alCambiar);
  }, []);

  const recargar = useCallback(() => {
    setVista((v) => ({ ...v, cargando: true }));
    setIntento((n) => n + 1);
  }, []);

  const { grupo, leidoEn, cargando, error } = vista;
  return { grupo, leidoEn, cargando, error, anuncio, recargar, aplicar };
};
