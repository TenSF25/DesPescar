import { Link } from 'react-router';
import { cantidadEnCarrito } from '@/features/cart/carrito';
import { useSincronizarCarrito } from '@/features/cart/hooks/useCarrito';
import { useCarritoStore } from '@/store/useCarritoStore';

/** Ícono del carrito con la cantidad de ítems. Solo se muestra con sesión iniciada. */
export const CartButton = () => {
  useSincronizarCarrito();
  const cantidad = useCarritoStore((s) => cantidadEnCarrito(s.carrito));
  const etiqueta =
    cantidad === 0 ? 'Carrito vacío' : `Carrito, ${cantidad} ${cantidad === 1 ? 'ítem' : 'ítems'}`;

  return (
    <Link
      to="/carrito"
      aria-label={etiqueta}
      className="text-secondary hover:bg-secondary/5 relative flex h-11 w-11 items-center justify-center rounded-full transition-colors"
    >
      <span aria-hidden className="material-symbols-outlined text-[26px]!">
        shopping_cart
      </span>
      {/* Siempre montado para que los lectores de pantalla anuncien los cambios de cantidad. */}
      <span role="status" aria-live="polite" className="absolute -top-0.5 -right-0.5">
        <span className="sr-only">{etiqueta}</span>
        {cantidad > 0 && (
          <span
            aria-hidden
            className="bg-primary flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold text-white"
          >
            {cantidad > 9 ? '9+' : cantidad}
          </span>
        )}
      </span>
    </Link>
  );
};
