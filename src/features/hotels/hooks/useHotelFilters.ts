import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Hotel } from '../hotels.types';

export type PriceRangeKey = 'menos100' | '100a200' | 'mas200';

export const PRICE_RANGES: { key: PriceRangeKey; label: string; check: (p: number) => boolean }[] = [
  { key: 'menos100', label: 'Menos de $100', check: (p) => p < 100 },
  { key: '100a200', label: '$100 a $200', check: (p) => p >= 100 && p <= 200 },
  { key: 'mas200', label: 'Más de $200', check: (p) => p > 200 },
];

export const TIPOS_HOTEL = ['Boutique', 'Resort All-Inclusive', 'Negocios', 'Apartamentos'];

export const SERVICIOS: { key: string; label: string }[] = [
  { key: 'wifi', label: 'WiFi gratis' },
  { key: 'piscina', label: 'Piscina' },
  { key: 'desayuno', label: 'Desayuno incl.' },
  { key: 'spa', label: 'Spa / Bienestar' },
  { key: 'gimnasio', label: 'Gimnasio' },
];

export type OrdenKey = 'populares' | 'menor' | 'mayor';

export const useHotelFilters = (hoteles: Hotel[]) => {
  // Buscador (Destino / Check-in / Check-out / Huéspedes)
  // Si llegamos con ?destino=Barcelona en la URL (ej: desde las pills de
  // "Destinos Populares"), arrancamos el buscador ya con ese valor cargado.
  const [searchParams] = useSearchParams();
  const [destino, setDestino] = useState(() => searchParams.get('destino') ?? '');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [huespedes, setHuespedes] = useState(1);

  // Filtros del sidebar
  const [estrellas, setEstrellas] = useState<Set<number>>(new Set());
  const [precios, setPrecios] = useState<Set<PriceRangeKey>>(new Set());
  const [tipos, setTipos] = useState<Set<string>>(new Set());
  const [servicios, setServicios] = useState<Set<string>>(new Set());
  const [orden, setOrden] = useState<OrdenKey>('populares');

  const toggleSetValue = <T,>(set: Set<T>, setState: (s: Set<T>) => void, value: T) => {
    const copia = new Set(set);
    if (copia.has(value)) {
      copia.delete(value);
    } else {
      copia.add(value);
    }
    setState(copia);
  };

  const toggleEstrella = (n: number) => toggleSetValue(estrellas, setEstrellas, n);
  const togglePrecio = (key: PriceRangeKey) => toggleSetValue(precios, setPrecios, key);
  const toggleTipo = (tipo: string) => toggleSetValue(tipos, setTipos, tipo);
  const toggleServicio = (key: string) => toggleSetValue(servicios, setServicios, key);

  const resetFiltros = () => {
    setEstrellas(new Set());
    setPrecios(new Set());
    setTipos(new Set());
    setServicios(new Set());
    setOrden('populares');
  };

  const resetBusqueda = () => {
    setDestino('');
    setCheckIn('');
    setCheckOut('');
    setHuespedes(1);
  };

  const hotelesFiltrados = useMemo(() => {
    let resultado = hoteles.filter((hotel) => {
      // Búsqueda por destino: coincide con nombre del hotel, ciudad o país
      // (sin distinguir mayúsculas ni acentos)
      if (destino.trim() !== '') {
        const normalizar = (texto: string) =>
          texto
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''); // saca tildes: á->a, é->e, etc.

        const busqueda = normalizar(destino.trim());
        const coincideDestino =
          normalizar(hotel.nombre).includes(busqueda) ||
          normalizar(hotel.ciudad).includes(busqueda) ||
          normalizar(hotel.pais).includes(busqueda);
        if (!coincideDestino) return false;
      }

      // Huéspedes: al menos una habitación debe alcanzar la capacidad pedida
      if (huespedes > 1 && hotel.habitaciones) {
        const hayHabitacionSuficiente = hotel.habitaciones.some(
          (h) => h.capacidad >= huespedes,
        );
        if (!hayHabitacionSuficiente) return false;
      }

      if (estrellas.size > 0 && !estrellas.has(hotel.estrellas)) return false;

      if (precios.size > 0) {
        const coincidePrecio = Array.from(precios).some((key) =>
          PRICE_RANGES.find((r) => r.key === key)?.check(hotel.precioPorNoche),
        );
        if (!coincidePrecio) return false;
      }

      if (tipos.size > 0 && !tipos.has(hotel.tipo)) return false;

      if (servicios.size > 0) {
        const tieneTodos = Array.from(servicios).every((s) => hotel.servicios.includes(s));
        if (!tieneTodos) return false;
      }

      return true;
    });

    if (orden === 'menor') {
      resultado = [...resultado].sort((a, b) => a.precioPorNoche - b.precioPorNoche);
    } else if (orden === 'mayor') {
      resultado = [...resultado].sort((a, b) => b.precioPorNoche - a.precioPorNoche);
    }

    return resultado;
  }, [hoteles, destino, huespedes, estrellas, precios, tipos, servicios, orden]);

  const totalFiltrosActivos = estrellas.size + precios.size + tipos.size + servicios.size;

  return {
    // Buscador
    destino,
    setDestino,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    huespedes,
    setHuespedes,
    resetBusqueda,
    // Filtros
    estrellas,
    precios,
    tipos,
    servicios,
    orden,
    setOrden,
    toggleEstrella,
    togglePrecio,
    toggleTipo,
    toggleServicio,
    resetFiltros,
    hotelesFiltrados,
    totalFiltrosActivos,
  };
};
