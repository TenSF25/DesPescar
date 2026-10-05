import { createContext, useContext } from 'react';

export type Formulario = 'pasajeros' | 'titulares';

export interface CarritoUi {
  /** Texto para la región viva (polite) de la página. */
  anunciar: (texto: string) => void;
  /** Un ítem salió del carrito: lo anuncia y lleva el foco al título de la página. */
  itemQuitado: (texto: string) => void;
  /** Un formulario entró o salió del modo edición (mientras edita no se puede pagar). */
  marcarEdicion: (formulario: Formulario, editando: boolean) => void;
}

const sinPagina: CarritoUi = {
  anunciar: () => {},
  itemQuitado: () => {},
  marcarEdicion: () => {},
};

export const CarritoUiContext = createContext<CarritoUi>(sinPagina);

export const useCarritoUi = () => useContext(CarritoUiContext);
