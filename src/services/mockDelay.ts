/**
 * Simula la latencia de una llamada de red real.
 * Se usa en todos los `services/*.ts` mock para que el comportamiento
 * async (loading states, spinners, etc.) sea igual al que van a tener
 * cuando se conecten los microservicios reales.
 */
export const mockDelay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
