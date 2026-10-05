export const TIPOS_DOCUMENTO_TITULAR = ['DNI', 'CUIT', 'Pasaporte'] as const;
export type TipoDocumentoTitular = (typeof TIPOS_DOCUMENTO_TITULAR)[number];

/** Bancos emisores más comunes en Argentina, para el selector. */
export const BANCOS = [
  'Banco de la Nación Argentina',
  'Banco Galicia',
  'Banco Santander',
  'BBVA',
  'Banco Macro',
  'Banco Provincia',
  'Banco Ciudad',
  'Banco Credicoop',
  'HSBC',
  'ICBC',
  'Banco Patagonia',
  'Banco Supervielle',
  'Brubank',
  'Naranja X',
  'Ualá',
  'Otro banco',
] as const;

/** Cantidad de cuotas que se ofrecen con tarjeta de crédito. */
export const CUOTAS = [1, 3, 6, 12] as const;

/** Datos de la tarjeta. Solo viven en el estado del formulario: no se guardan ni se envían a ningún lado. */
export interface CardData {
  numero: string;
  titular: string;
  vencimiento: string; // MM/AA
  cvv: string;
  tipoDocumento: TipoDocumentoTitular;
  documento: string;
  banco: string;
  cuotas: number;
}

export const emptyCard = (): CardData => ({
  numero: '',
  titular: '',
  vencimiento: '',
  cvv: '',
  tipoDocumento: 'DNI',
  documento: '',
  banco: '',
  cuotas: 1,
});

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'otra';

export const BRAND_LABEL: Record<CardBrand, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  otra: '',
};
