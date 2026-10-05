import axios from 'axios';

const STATUS_MESSAGES: Record<number, string> = {
  403: 'Tu cuenta no tiene permisos para realizar esta acción.',
  429: 'Hiciste demasiadas solicitudes seguidas. Esperá un momento e intentá de nuevo.',
  502: 'El servicio no está disponible en este momento. Intentá de nuevo más tarde.',
  503: 'El servicio no está disponible en este momento. Intentá de nuevo más tarde.',
  504: 'El servidor tardó demasiado en responder. Intentá de nuevo.',
};

/**
 * Mensaje legible para un error de una llamada al gateway. Prioriza el mensaje que manda el
 * backend; si no hay, traduce los códigos que el gateway devuelve por sí mismo (rol, límite de
 * peticiones, timeout) y los errores de red.
 */
export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string; mensaje?: string }>(error)) {
    if (!error.response) return 'No se pudo conectar con el servidor. Revisá tu conexión.';

    // Los servicios de reservas responden con `mensaje`; los demás con `message`.
    const backendMessage = error.response.data?.message ?? error.response.data?.mensaje;
    if (backendMessage) return backendMessage;

    return STATUS_MESSAGES[error.response.status] ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
};
