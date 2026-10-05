import { useCallback, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useCarritoStore } from '@/store/useCarritoStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useFlightStore } from '@/store/useFlightStore';
import type { KoiOpcion } from '../koi.types';
import { estadoDeAsientos, type AccionKoi } from '../koiAcciones';
import { ejecutarFlujoCarrito, type DepsCarrito, type EstadiaAgregada } from '../koiCarritoFlujo';
import { marcarChatAbierto } from '../koiSesion';

export type EstadoKoiCarrito =
  | { tipo: 'libre' }
  | { tipo: 'ocupado' }
  | { tipo: 'confirmarReemplazo'; opcion: KoiOpcion; accion: AccionKoi }
  | { tipo: 'agregado' }
  | { tipo: 'error'; texto: string };

// Acciones del store: descartan lo que llega después de cerrar sesión (generación)
const depsDelStore = (): DepsCarrito => {
  const s = useCarritoStore.getState();
  return {
    recargar: s.recargar,
    leer: () => {
      const { carrito, error } = useCarritoStore.getState();
      return { carrito, error };
    },
    agregarEstadia: s.agregarEstadia,
    quitarVuelo: s.quitarVuelo,
  };
};

/**
 * Ejecuta los botones de las opciones de KOI contra el carrito. El orden y los errores los
 * decide ejecutarFlujoCarrito (con tests); acá solo van el estado de pantalla y la navegación.
 */
export const useKoiCarrito = (alSalirDelChat: () => void) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [estado, setEstado] = useState<EstadoKoiCarrito>({ tipo: 'libre' });
  const enCurso = useRef(false);
  const agregada = useRef<EstadiaAgregada>({ clave: null });

  const ejecutar = useCallback(
    async (opcion: KoiOpcion, accion: AccionKoi, reemplazar = false) => {
      if (enCurso.current) return; // doble clic
      if (!user) {
        // Sin sesión: al login y de vuelta a esta página con el chat abierto (spec 4.9)
        marcarChatAbierto();
        alSalirDelChat();
        navigate('/login', { state: { from: location } });
        return;
      }

      enCurso.current = true;
      setEstado({ tipo: 'ocupado' });
      try {
        const salida = await ejecutarFlujoCarrito(
          opcion,
          accion,
          reemplazar,
          depsDelStore(),
          agregada.current,
        );
        switch (salida.tipo) {
          case 'confirmarReemplazo':
            setEstado({ tipo: 'confirmarReemplazo', opcion, accion });
            break;
          case 'asientos':
            useFlightStore.setState(estadoDeAsientos(salida.vuelo));
            setEstado({ tipo: 'libre' });
            alSalirDelChat();
            navigate(salida.destino);
            break;
          case 'agregado':
            setEstado({ tipo: 'agregado' });
            break;
          case 'descartado':
            setEstado({ tipo: 'libre' });
            break;
          case 'error':
            setEstado({ tipo: 'error', texto: salida.texto });
            void useCarritoStore.getState().recargar();
            break;
        }
      } catch (error) {
        console.error('KOI: no se pudo agregar al carrito', error);
        setEstado({ tipo: 'error', texto: 'No pude agregarlo al carrito. Probá de nuevo.' });
      } finally {
        enCurso.current = false;
      }
    },
    [user, navigate, location, alSalirDelChat],
  );

  const confirmarReemplazo = useCallback(() => {
    if (estado.tipo === 'confirmarReemplazo') {
      void ejecutar(estado.opcion, estado.accion, true);
    }
  }, [estado, ejecutar]);

  const descartar = useCallback(() => setEstado({ tipo: 'libre' }), []);

  /** Al mandar un mensaje nuevo se borran los avisos de agregado y de error. */
  const limpiarAvisos = useCallback(
    () =>
      setEstado((e) => (e.tipo === 'agregado' || e.tipo === 'error' ? { tipo: 'libre' } : e)),
    [],
  );

  return { estado, ejecutar, confirmarReemplazo, descartar, limpiarAvisos };
};
