import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCarritoStore } from '@/store/useCarritoStore';

/**
 * Sincroniza el carrito con la sesión: lo carga al iniciar sesión, lo vacía al cerrarla (el
 * ícono se desmonta) y lo vuelve a pedir un segundo después de que vence (el back lo marca
 * EXPIRADA y GET /carrito responde 204). Se monta una sola vez, en el ícono del Nav.
 */
export const useSincronizarCarrito = () => {
  const userId = useAuthStore((s) => s.user?.id);
  const venceEn = useCarritoStore((s) => s.venceEn);
  const recargar = useCarritoStore((s) => s.recargar);
  const limpiar = useCarritoStore((s) => s.limpiar);

  useEffect(() => {
    if (!userId) return;
    void recargar();
    return () => limpiar();
  }, [userId, recargar, limpiar]);

  useEffect(() => {
    if (!userId || venceEn === null) return;
    const espera = Math.max(0, venceEn - Date.now()) + 1000;
    const t = window.setTimeout(() => void recargar(), espera);
    return () => window.clearTimeout(t);
  }, [userId, venceEn, recargar]);
};

/** El carrito para las páginas: lo pide si todavía no se cargó en esta sesión. */
export const useCarrito = () => {
  const estado = useCarritoStore();
  const { cargado, cargando, recargar } = estado;

  useEffect(() => {
    if (!cargado && !cargando) void recargar();
  }, [cargado, cargando, recargar]);

  return estado;
};
