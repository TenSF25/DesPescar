/** Códigos de discado más usados por quienes viajan en Argentina (país + código), el primero es el predeterminado. */
export const DIAL_CODES = [
  { code: '+54', country: 'Argentina' },
  { code: '+598', country: 'Uruguay' },
  { code: '+56', country: 'Chile' },
  { code: '+55', country: 'Brasil' },
  { code: '+595', country: 'Paraguay' },
  { code: '+591', country: 'Bolivia' },
  { code: '+51', country: 'Perú' },
  { code: '+57', country: 'Colombia' },
  { code: '+593', country: 'Ecuador' },
  { code: '+58', country: 'Venezuela' },
  { code: '+52', country: 'México' },
  { code: '+1', country: 'Estados Unidos / Canadá' },
  { code: '+34', country: 'España' },
  { code: '+39', country: 'Italia' },
] as const;

export const DEFAULT_DIAL_CODE = DIAL_CODES[0].code;

export const NACIONALIDADES = [
  'Argentina',
  'Bolivia',
  'Brasil',
  'Chile',
  'Colombia',
  'Ecuador',
  'España',
  'Estados Unidos',
  'Italia',
  'México',
  'Paraguay',
  'Perú',
  'Uruguay',
  'Venezuela',
  'Otra',
] as const;

/**
 * Separa un teléfono escrito libremente ("+54 11 5555-1234") en código de país y número.
 * Si no empieza con "+" se asume el código predeterminado.
 */
export const splitPhone = (telefono: string) => {
  const limpio = telefono.trim();
  if (limpio.startsWith('+')) {
    // El código más largo que coincida: "+598" gana sobre "+5".
    const match = [...DIAL_CODES]
      .sort((a, b) => b.code.length - a.code.length)
      .find(({ code }) => limpio.startsWith(code));
    if (match)
      return { codigo: match.code, numero: limpio.slice(match.code.length).replace(/\D/g, '') };
  }
  return { codigo: DEFAULT_DIAL_CODE, numero: limpio.replace(/\D/g, '') };
};
