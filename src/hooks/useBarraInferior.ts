import { useEffect } from 'react';

// Marca el body mientras la pagina muestra una barra fija inferior, para que
// la burbuja de KOI se desplace hacia arriba y no tape el boton de continuar.
export const useBarraInferior = () => {
  useEffect(() => {
    document.body.dataset.barraInferior = 'true';
    return () => {
      delete document.body.dataset.barraInferior;
    };
  }, []);
};
