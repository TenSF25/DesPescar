import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '@/store/useAuthStore';
import { useCarritoStore } from '@/store/useCarritoStore';
import { esperaParaReconsultar } from '../carrito';

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
    const t = window.setTimeout(() => void recargar(), esperaParaReconsultar(venceEn, Date.now()));
    return () => window.clearTimeout(t);
  }, [userId, venceEn, recargar]);
};

/**
 * El carrito para las páginas. Lo pide una sola vez por montaje y usuario si todavía no se
 * cargó; si esa carga falla no reintenta solo: la página ofrece "Reintentar" (recargar).
 */
export const useCarrito = () => {
  const userId = useAuthStore((s) => s.user?.id);
  const estado = useCarritoStore(
    useShallow((s) => ({
      carrito: s.carrito,
      venceEn: s.venceEn,
      cargado: s.cargado,
      cargando: s.cargando,
      error: s.error,
      expirado: s.expirado,
      recargar: s.recargar,
    })),
  );
  const pedidoPara = useRef<number | null | undefined>(undefined);

  useEffect(() => {
    const clave = userId ?? null;
    if (pedidoPara.current === clave) return;
    pedidoPara.current = clave;
    // Se lee el store en el momento: el ícono del Nav pudo haber empezado la carga en este commit.
    const { cargado, cargando, recargar } = useCarritoStore.getState();
    if (!cargado && !cargando) void recargar();
  }, [userId]);

  return estado;
};
