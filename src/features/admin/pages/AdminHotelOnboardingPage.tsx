import { useState } from 'react';
import { PageHeader, Select } from '../../../components/admin';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { TIPOS_HOTEL } from '../../hotels/hooks/useHotelFilters';
import { guardarHotelRegistrado } from '../../../utils/hotelLocalStore';
import type { Habitacion } from '../../hotels/hotels.types';

interface HabitacionForm {
  nombre: string;
  descripcion: string;
  precioPorNoche: string;
  capacidad: string;
}

const HABITACION_VACIA: HabitacionForm = { nombre: '', descripcion: '', precioPorNoche: '', capacidad: '2' };

// Foto genérica para hoteles nuevos, hasta que exista una forma real de subir fotos.
const IMAGEN_POR_DEFECTO = 'https://images.unsplash.com/photo-1566073771259-6a8506099945';

export const AdminHotelOnboardingPage = () => {
  const [nombre, setNombre] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [pais, setPais] = useState('');
  const [tipo, setTipo] = useState(TIPOS_HOTEL[0]);
  const [estrellas, setEstrellas] = useState(3);
  const [descripcion, setDescripcion] = useState('');
  const [habitaciones, setHabitaciones] = useState<HabitacionForm[]>([HABITACION_VACIA]);
  const [error, setError] = useState<string | null>(null);

  const actualizarHabitacion = (i: number, campo: keyof HabitacionForm, valor: string) => {
    setHabitaciones((prev) => prev.map((h, idx) => (idx === i ? { ...h, [campo]: valor } : h)));
  };

  const agregarHabitacion = () => setHabitaciones((prev) => [...prev, HABITACION_VACIA]);

  const quitarHabitacion = (i: number) =>
    setHabitaciones((prev) => prev.filter((_, idx) => idx !== i));

  const registrar = () => {
    if (nombre.trim() === '' || ciudad.trim() === '' || pais.trim() === '') {
      setError('Completá nombre, ciudad y país del hotel.');
      return;
    }
    const habitacionesValidas = habitaciones.filter(
      (h) => h.nombre.trim() !== '' && Number(h.precioPorNoche) > 0,
    );
    if (habitacionesValidas.length === 0) {
      setError('Agregá al menos una habitación con nombre y precio.');
      return;
    }

    const habitacionesFinal: Habitacion[] = habitacionesValidas.map((h, i) => ({
      id: i + 1,
      nombre: h.nombre,
      descripcion: h.descripcion || 'Sin descripción.',
      precioPorNoche: Number(h.precioPorNoche),
      capacidad: Number(h.capacidad) || 2,
      imageUrl: IMAGEN_POR_DEFECTO,
    }));

    const precioPorNoche = Math.min(...habitacionesFinal.map((h) => h.precioPorNoche));

    guardarHotelRegistrado({
      nombre,
      ciudad,
      pais,
      estrellas: estrellas as 1 | 2 | 3 | 4 | 5,
      precioPorNoche,
      imageUrl: IMAGEN_POR_DEFECTO,
      tipo: tipo as 'Boutique' | 'Resort All-Inclusive' | 'Negocios' | 'Apartamentos',
      servicios: ['wifi'],
      activo: true,
      descripcion: descripcion || undefined,
      galeria: [IMAGEN_POR_DEFECTO],
      habitaciones: habitacionesFinal,
      resenas: [],
    });

    // Recarga completa para que todos los hooks relean localStorage desde cero
    // con el hotel recién creado ya disponible.
    window.location.href = '/admin/hoteles';
  };

  return (
    <div className="mx-auto flex w-full max-w-200 flex-col gap-6">
      <PageHeader
        title="Registrar mi hotel"
        description="Cargá los datos de tu hotel para empezar a recibir reservas en Despescar."
      />

      <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="text-secondary font-semibold">Datos del hotel</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input contentLabel="Nombre del hotel" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <Input contentLabel="Ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
          <Input contentLabel="País" value={pais} onChange={(e) => setPais(e.target.value)} />
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#1A2B4C]">Tipo</label>
            <Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              {TIPOS_HOTEL.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#1A2B4C]">Estrellas</label>
            <Select value={estrellas} onChange={(e) => setEstrellas(Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n} estrella{n > 1 ? 's' : ''}</option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="font-semibold text-[#1A2B4C]">Descripción (opcional)</label>
            <textarea
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full rounded-xl border border-black/20 p-2"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-secondary font-semibold">Habitaciones</h2>
          <Button variant="secondary" className="w-auto" onClick={agregarHabitacion}>
            + Agregar habitación
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {habitaciones.map((h, i) => (
            <div key={i} className="grid grid-cols-1 gap-3 rounded-xl border border-black/10 p-4 sm:grid-cols-[2fr_1fr_1fr_auto]">
              <Input
                contentLabel="Nombre de la habitación"
                value={h.nombre}
                onChange={(e) => actualizarHabitacion(i, 'nombre', e.target.value)}
              />
              <Input
                contentLabel="Precio por noche"
                type="number"
                min={0}
                value={h.precioPorNoche}
                onChange={(e) => actualizarHabitacion(i, 'precioPorNoche', e.target.value)}
              />
              <Input
                contentLabel="Capacidad"
                type="number"
                min={1}
                value={h.capacidad}
                onChange={(e) => actualizarHabitacion(i, 'capacidad', e.target.value)}
              />
              {habitaciones.length > 1 && (
                <button
                  type="button"
                  onClick={() => quitarHabitacion(i)}
                  className="text-alert flex items-center justify-center self-end pb-2"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-alert rounded-lg bg-red-50 p-3 text-sm">{error}</p>}

      <Button variant="primary" className="bg-primary text-white" onClick={registrar}>
        Registrar hotel y entrar a mi panel
      </Button>

      <p className="text-xs text-[#44474E]">
        Nota: sin backend todavía, esto se guarda en tu navegador (localStorage) — no es una
        base de datos real, así que solo lo vas a ver vos, en este navegador.
      </p>
    </div>
  );
};
