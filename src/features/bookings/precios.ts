import { formatCurrency } from '@/utils/formatCurrency';

/** Lo que suma una tarifa sobre el precio del vuelo (D2: Light 0, Standard 45.000 por tramo). */
export const textoTarifa = (monto: number): { principal: string; aclaracion: string } =>
  monto > 0
    ? { principal: `+ ${formatCurrency(monto)}`, aclaracion: 'Por persona y tramo' }
    : { principal: 'Sin cargo extra', aclaracion: 'Incluida en el precio' };

/** D3: elegir asiento no se cobra; el mapa informa precio 0. */
export const precioAsiento = (precio: number | undefined) =>
  !precio || precio <= 0 ? 'Sin cargo' : formatCurrency(precio);
