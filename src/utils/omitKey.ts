/** Copia del objeto sin la clave indicada. */
export const omitKey = <T extends Record<string, unknown>>(obj: T, key: string): T =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => k !== key)) as T;
