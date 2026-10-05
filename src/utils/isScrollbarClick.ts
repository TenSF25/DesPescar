/**
 * Indica si un evento del mouse cayó sobre una barra de scroll. El navegador dispara `mousedown` con
 * el elemento que scrollea como destino, así que sin esta guarda los "cerrar al hacer clic afuera"
 * se activan al arrastrar la barra de la página.
 */
export const isScrollbarClick = (event: MouseEvent) => {
  const target = event.target;
  if (!(target instanceof Element)) return false;

  const { left, top } =
    target === document.documentElement ? { left: 0, top: 0 } : target.getBoundingClientRect();

  // clientWidth/clientHeight excluyen la barra: un clic más allá de ellos está sobre la barra.
  return event.clientX - left >= target.clientWidth || event.clientY - top >= target.clientHeight;
};
