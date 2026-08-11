import { useEffect, useMemo, useState } from 'react';
import type { Escala, Vuelo } from '../features/flights/flights.types';

type Orden = 'mejor' | 'precio_asc' | 'precio_desc' | 'duracion';
export type EquipajeFiltro = 'Todos' | 'mano' | 'bodega';

const horaAMinutos = (hora: string) => {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
};

export const useFlights = () => {
  const [vuelos, setVuelos] = useState<Vuelo[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('');
  const [escalaFiltro, setEscalaFiltro] = useState<Escala | 'Todos'>('Todos');
  const [aerolineasFiltro, setAerolineasFiltro] = useState<string[]>([]);
  const [equipajeFiltro, setEquipajeFiltro] = useState<EquipajeFiltro>('Todos');
  const [horarioMin, setHorarioMin] = useState(0);
  const [horarioMax, setHorarioMax] = useState(23 * 60 + 59);
  const [orden, setOrden] = useState<Orden>('mejor');

  useEffect(() => {
    fetch('/json/vuelos.json')
      .then((res) => res.json())
      .then((datos: Vuelo[]) => {
        setVuelos(datos);
        if (datos.length > 0) setFechaSeleccionada(datos[0].fecha);
      })
      .catch((e) => console.log(e));
  }, []);

  const fechasDisponibles = useMemo(() => {
    const mapa = new Map<string, number>();
    vuelos.forEach((v) => {
      const actual = mapa.get(v.fecha);
      if (actual === undefined || v.precio < actual) mapa.set(v.fecha, v.precio);
    });
    return Array.from(mapa.entries())
      .map(([fecha, precioDesde]) => ({ fecha, precioDesde }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
  }, [vuelos]);

  const aerolineasDisponibles = useMemo(() => {
    const mapa = new Map<string, number>();
    vuelos
      .filter((v) => v.fecha === fechaSeleccionada)
      .forEach((v) => {
        const actual = mapa.get(v.aerolinea);
        if (actual === undefined || v.precio < actual) mapa.set(v.aerolinea, v.precio);
      });
    return Array.from(mapa.entries()).map(([nombre, precioDesde]) => ({ nombre, precioDesde }));
  }, [vuelos, fechaSeleccionada]);

  const toggleAerolinea = (nombre: string) => {
    setAerolineasFiltro((prev) =>
      prev.includes(nombre) ? prev.filter((a) => a !== nombre) : [...prev, nombre],
    );
  };

  const vuelosFiltrados = useMemo(() => {
    let lista = vuelos.filter((v) => v.fecha === fechaSeleccionada);

    if (escalaFiltro !== 'Todos') {
      lista = lista.filter((v) => v.escalas === escalaFiltro);
    }

    if (aerolineasFiltro.length > 0) {
      lista = lista.filter((v) => aerolineasFiltro.includes(v.aerolinea));
    }

    if (equipajeFiltro === 'mano') {
      lista = lista.filter((v) => v.equipajeMano);
    }
    if (equipajeFiltro === 'bodega') {
      lista = lista.filter((v) => v.equipajeBodega);
    }

    lista = lista.filter((v) => {
      const minutos = horaAMinutos(v.horaSalida);
      return minutos >= horarioMin && minutos <= horarioMax;
    });

    const listaOrdenada = [...lista];
    switch (orden) {
      case 'precio_asc':
        listaOrdenada.sort((a, b) => a.precio - b.precio);
        break;
      case 'precio_desc':
        listaOrdenada.sort((a, b) => b.precio - a.precio);
        break;
      case 'duracion':
        listaOrdenada.sort((a, b) => a.duracion.localeCompare(b.duracion));
        break;
      default:
        listaOrdenada.sort((a, b) => a.precio - b.precio);
    }

    return listaOrdenada;
  }, [
    vuelos,
    fechaSeleccionada,
    escalaFiltro,
    aerolineasFiltro,
    equipajeFiltro,
    horarioMin,
    horarioMax,
    orden,
  ]);

  return {
    fechasDisponibles,
    fechaSeleccionada,
    setFechaSeleccionada,
    aerolineasDisponibles,
    escalaFiltro,
    setEscalaFiltro,
    aerolineasFiltro,
    toggleAerolinea,
    equipajeFiltro,
    setEquipajeFiltro,
    horarioMin,
    horarioMax,
    setHorarioMin,
    setHorarioMax,
    orden,
    setOrden,
    vuelosFiltrados,
  };
};
