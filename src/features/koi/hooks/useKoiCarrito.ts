import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { leerErrorApi } from '@/features/cart/carrito';
import { agregarEstadia, obtenerCarrito, quitarVuelo } from '@/features/cart/services/carritoService';
import { useCarritoStore } from '@/store/useCarritoStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useFlightStore } from '@/store/useFlightStore';
import type { KoiOpcion } from '../koi.types';
import {
  estadoDeAsientos,
  mensajeErrorCarrito,
  planDeCarrito,
  type AccionKoi,
} from '../koiAcciones';
import { marcarChatAbierto } from '../koiSesion';

export type EstadoKoiCarrito =
  | { tipo: 'libre' }
  | { tipo: 'ocupado' }
  | { tipo: 'confirmarReemplazo'; opcion: KoiOpcion; accion: AccionKoi }
  | { tipo: 'agregado' }
  | { tipo: 'error'; texto: string };

/** Al reemplazar, si el vuelo ya no está (404) o el carrito venció (410) no hay nada que quitar. */
const yaNoHayVuelo = (status: number | null, codigo: string | null) =>
  status === 410 || (status === 404 && (codigo === 'SIN_VUELO' || codigo === 'CARRITO_NO_ENCONTRADO'));

/**
 * Ejecuta los botones de las opciones de KOI contra el carrito. Lo que se agrega y a dónde
 * se navega lo decide planDeCarrito (puro, con tests); acá solo van las llamadas y la navegación.
 */
export const useKoiCarrito = (alSalirDelChat: () => void) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [estado, setEstado] = useState<EstadoKoiCarrito>({ tipo: 'libre' });

  const ejecutar = useCallback(
    async (opcion: KoiOpcion, accion: AccionKoi, reemplazarVuelo = false) => {
      if (!user) {
        // Sin sesión: al login y de vuelta a esta página con el chat abierto (spec 4.9)
        marcarChatAbierto();
        alSalirDelChat();
        navigate('/login', { state: { from: location } });
        return;
      }

      const plan = planDeCarrito(opcion, accion);
      setEstado({ tipo: 'ocupado' });
      try {
        if (plan.vuelo) {
          if (reemplazarVuelo) {
            try {
              useCarritoStore.getState().setCarrito(await quitarVuelo());
            } catch (error) {
              const { status, codigo } = leerErrorApi(error, '');
              if (!yaNoHayVuelo(status, codigo)) throw error;
            }
          } else {
            const carrito = await obtenerCarrito();
            if (carrito?.vuelo) {
              setEstado({ tipo: 'confirmarReemplazo', opcion, accion });
              return;
            }
          }
        }

        if (plan.estadia) {
          // La respuesta es el carrito completo: se guarda y el ícono del Nav se actualiza
          useCarritoStore.getState().setCarrito(await agregarEstadia(plan.estadia));
        }

        if (plan.vuelo && plan.navegarA) {
          useFlightStore.setState(estadoDeAsientos(plan.vuelo));
          setEstado({ tipo: 'libre' });
          alSalirDelChat();
          navigate(plan.navegarA);
          return;
        }

        setEstado({ tipo: 'agregado' });
      } catch (error) {
        const { status, codigo } = leerErrorApi(error, '');
        console.error('KOI: no se pudo agregar al carrito', status, codigo);
        setEstado({
          tipo: 'error',
          texto: mensajeErrorCarrito(status ?? undefined, codigo ?? undefined),
        });
        // El carrito pudo cambiar (vencer, quedar sin vuelo): se vuelve a consultar
        void useCarritoStore.getState().recargar();
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

  return { estado, ejecutar, confirmarReemplazo, descartar };
};
