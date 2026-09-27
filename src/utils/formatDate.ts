export const formatDate = (fechaStr: string) => {
  if (!fechaStr) return '';

  const fecha = new Date(fechaStr);

  const formateador = new Intl.DateTimeFormat('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  // 2. Romper la fecha en partes para tener control total del diseño
  const partes = formateador.formatToParts(fecha);
  const p = Object.fromEntries(partes.map((part) => [part.type, part.value]));

  // 3. Limpiar los puntos que algunos navegadores agregan de más
  const diaSemana = p.weekday.replace('.', '').toLowerCase();
  const mes = p.month.replace('.', '').toLowerCase();

  // 4. Construir la cadena exacta: "mié. 25 nov. 2026 - 21:00"
  return `${diaSemana}. ${p.day} ${mes}. ${p.year} - ${p.hour}:${p.minute}`;
};
