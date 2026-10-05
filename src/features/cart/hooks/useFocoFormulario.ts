import { useEffect, useRef } from 'react';

/** Destino del foco después del próximo render de un formulario. */
export type DestinoFoco = 'formulario' | 'cambiar' | null;

/**
 * Lleva el foco al primer campo al empezar a editar y al botón "Cambiar" (o a la card) al
 * guardar o cancelar. Corre después de cada render hasta que el destino existe.
 */
export const useFocoFormulario = () => {
  const destino = useRef<DestinoFoco>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const botonRef = useRef<HTMLButtonElement>(null);
  const seccionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (destino.current === 'formulario' && formRef.current) {
      formRef.current.querySelector<HTMLInputElement>('input')?.focus();
      destino.current = null;
    } else if (destino.current === 'cambiar' && (botonRef.current || seccionRef.current)) {
      (botonRef.current ?? seccionRef.current)?.focus();
      destino.current = null;
    }
  });

  /** Tras validar con errores: foco al primer campo inválido, ya marcado en el DOM. */
  const enfocarPrimerError = () =>
    window.setTimeout(
      () => formRef.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus(),
      0,
    );

  /** Pide llevar el foco a ese destino después del próximo render. */
  const enfocarDespues = (d: DestinoFoco) => {
    destino.current = d;
  };

  return { formRef, botonRef, seccionRef, enfocarDespues, enfocarPrimerError };
};
