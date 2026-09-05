import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PageHeader,
  StatCard,
  ChartCard,
  DonutChart,
  LineChart,
  ActivityListItem,
  SearchFilterBar,
  Select,
  DataTable,
  Badge,
  ActionsMenu,
  type TableColumn,
} from '../../../components/admin';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { formatCurrency } from '../../../utils/formatCurrency';
import { TIPOS_HOTEL } from '../../hotels/hooks/useHotelFilters';
import { useHotelGuests, type HotelGuest } from '../hooks/useHotelGuests';
import type { Hotel, ReservaHotel } from '../../hotels/hotels.types';

// TODO: cuando exista login real, este id sale de la sesión del usuario logueado
// (la hotelera con la que inició sesión), no de una constante fija.
const MI_HOTEL_ID = 1;

const MESES_CORTOS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

const calcularReservasPorMes = (reservas: ReservaHotel[]) => {
  const conteo = new Map<string, number>();
  reservas.forEach((r) => {
    const [anio, mes] = r.fechaInicio.split('-');
    const clave = `${anio}-${mes}`;
    conteo.set(clave, (conteo.get(clave) ?? 0) + 1);
  });
  return Array.from(conteo.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([clave, value]) => {
      const [anio, mes] = clave.split('-');
      return { label: `${MESES_CORTOS[Number(mes) - 1]} ${anio.slice(2)}`, value };
    });
};

const ESTADO_RESERVA_INFO: Record<ReservaHotel['estado'], { label: string; color: string }> = {
  proximo: { label: 'Próximas', color: '#3457a6' },
  completado: { label: 'Completadas', color: '#1f3051' },
  cancelado: { label: 'Canceladas', color: '#ba1a1a' },
};

const ACTIVIDAD_INFO: Record<
  ReservaHotel['estado'],
  { icon: string; iconClassName: string; titulo: string }
> = {
  proximo: { icon: 'event_available', iconClassName: 'bg-blue-100 text-blue-600', titulo: 'Nueva reserva realizada' },
  completado: { icon: 'task_alt', iconClassName: 'bg-green-100 text-green-600', titulo: 'Estadía completada' },
  cancelado: { icon: 'cancel', iconClassName: 'bg-red-100 text-alert', titulo: 'Reserva cancelada' },
};

/** Interruptor simple (on/off), no viene en el kit de admin todavía. */
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
      checked ? 'bg-primary' : 'bg-black/20'
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
        checked ? 'translate-x-5' : ''
      }`}
    />
  </button>
);

interface FormularioHotel {
  nombre: string;
  ciudad: string;
  pais: string;
  tipo: string;
  estrellas: number;
  precioPorNoche: number;
  activo: boolean;
}

export const AdminHotelsPage = () => {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [reservas, setReservas] = useState<ReservaHotel[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<FormularioHotel | null>(null);
  const [disponibilidad, setDisponibilidad] = useState<Record<number, boolean>>({});
  const [guardado, setGuardado] = useState(false);

  const { huespedes, loading: loadingHuespedes, toggleEstado } = useHotelGuests(MI_HOTEL_ID);
  const [searchHuesped, setSearchHuesped] = useState('');
  const [estadoHuespedFiltro, setEstadoHuespedFiltro] = useState('todos');

  useEffect(() => {
    Promise.all([
      fetch('/json/hoteles.json').then((res) => res.json()),
      fetch('/json/reservas-hotel.json').then((res) => res.json()),
    ])
      .then(([hoteles, reservasData]: [Hotel[], ReservaHotel[]]) => {
        const miHotel = hoteles.find((h) => h.id === MI_HOTEL_ID) ?? null;
        setHotel(miHotel);
        setReservas(reservasData.filter((r) => r.hotelId === MI_HOTEL_ID));
        if (miHotel) {
          setForm({
            nombre: miHotel.nombre,
            ciudad: miHotel.ciudad,
            pais: miHotel.pais,
            tipo: miHotel.tipo,
            estrellas: miHotel.estrellas,
            precioPorNoche: miHotel.precioPorNoche,
            activo: miHotel.activo !== false,
          });
          setDisponibilidad(
            Object.fromEntries((miHotel.habitaciones ?? []).map((h) => [h.id, true])),
          );
        }
      })
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }, []);

  const reservasPorMes = useMemo(() => calcularReservasPorMes(reservas), [reservas]);

  const reservasPorEstado = (['proximo', 'completado', 'cancelado'] as const)
    .map((estado) => ({
      label: ESTADO_RESERVA_INFO[estado].label,
      value: reservas.filter((r) => r.estado === estado).length,
      color: ESTADO_RESERVA_INFO[estado].color,
    }))
    .filter((d) => d.value > 0);

  const ingresosTotales = reservas
    .filter((r) => r.estado !== 'cancelado')
    .reduce((sum, r) => sum + r.precioTotal, 0);

  const huespedesFiltrados = huespedes.filter((h) => {
    const coincideBusqueda =
      searchHuesped.trim() === '' ||
      h.nombre.toLowerCase().includes(searchHuesped.toLowerCase()) ||
      h.email.toLowerCase().includes(searchHuesped.toLowerCase());
    const coincideEstado = estadoHuespedFiltro === 'todos' || h.estado === estadoHuespedFiltro;
    return coincideBusqueda && coincideEstado;
  });

  const columnsHuespedes: TableColumn<HotelGuest>[] = [
    {
      key: 'nombre',
      header: 'Huésped',
      render: (h) => (
        <div className="flex flex-col">
          <span className="font-semibold">{h.nombre}</span>
          <span className="text-xs text-[#44474E]">{h.email}</span>
        </div>
      ),
    },
    { key: 'telefono', header: 'Teléfono', render: (h) => h.telefono },
    { key: 'reservas', header: 'Reservas', render: (h) => h.reservasRealizadas },
    {
      key: 'estado',
      header: 'Estado',
      render: (h) => (
        <Badge tone={h.estado === 'activo' ? 'success' : 'danger'}>
          {h.estado === 'activo' ? 'Activo' : 'Bloqueado'}
        </Badge>
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (h) => <ActionsMenu onMore={() => toggleEstado(h.id)} />,
    },
  ];

  if (loading || !hotel || !form) {
    return <p className="p-6">Cargando...</p>;
  }

  const actualizar = <K extends keyof FormularioHotel>(campo: K, valor: FormularioHotel[K]) => {
    setForm((prev) => (prev ? { ...prev, [campo]: valor } : prev));
    setGuardado(false);
  };

  const guardarCambios = () => {
    // Sin backend todavía: simula el guardado en la UI, no persiste en ningún lado.
    setGuardado(true);
  };

  const actividadReciente = reservas.slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Mi Hotel: ${hotel.nombre}`}
        description="Administra la información, disponibilidad y huéspedes de tu hotel."
        actions={
          <div className="flex items-center gap-3">
            <Badge tone={form.activo ? 'success' : 'danger'}>{form.activo ? 'Activo' : 'Inactivo'}</Badge>
            <Link to="/admin/hoteles/reportes">
              <Button variant="secondary" className="w-auto">
                Ver Reportes
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="confirmation_number" iconClassName="bg-primary/10 text-primary" label="Reservas totales" value={reservas.length} />
        <StatCard icon="event_available" iconClassName="bg-blue-100 text-blue-600" label="Reservas activas" value={reservas.filter((r) => r.estado !== 'cancelado').length} />
        <StatCard icon="payments" iconClassName="bg-orange-100 text-orange-600" label="Ingresos totales" value={formatCurrency(ingresosTotales)} />
        <StatCard icon="group" iconClassName="bg-green-100 text-green-600" label="Huéspedes registrados" value={huespedes.length} />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <ChartCard title="Reservas por mes">
            <LineChart data={reservasPorMes} />
          </ChartCard>
        </div>
        <div className="min-w-0 lg:col-span-1">
          <ChartCard title="Reservas por estado">
            <DonutChart data={reservasPorEstado} />
          </ChartCard>
        </div>
      </div>

      <ChartCard title="Actividad reciente">
        <div className="flex flex-col gap-4">
          {actividadReciente.length === 0 ? (
            <p className="text-sm text-[#44474E]">Todavía no hay reservas en tu hotel.</p>
          ) : (
            actividadReciente.map((r) => {
              const info = ACTIVIDAD_INFO[r.estado];
              return (
                <ActivityListItem
                  key={r.id}
                  icon={info.icon}
                  iconClassName={info.iconClassName}
                  title={info.titulo}
                  subtitle={r.codigoConfirmacion}
                  time={r.fechaInicio}
                />
              );
            })
          )}
        </div>
      </ChartCard>

      {/* Información general */}
      <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="text-secondary font-semibold">Información general</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input contentLabel="Nombre" value={form.nombre} onChange={(e) => actualizar('nombre', e.target.value)} />
          <Input contentLabel="Ciudad" value={form.ciudad} onChange={(e) => actualizar('ciudad', e.target.value)} />
          <Input contentLabel="País" value={form.pais} onChange={(e) => actualizar('pais', e.target.value)} />
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#1A2B4C]">Tipo</label>
            <Select value={form.tipo} onChange={(e) => actualizar('tipo', e.target.value)}>
              {TIPOS_HOTEL.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#1A2B4C]">Estrellas</label>
            <Select value={form.estrellas} onChange={(e) => actualizar('estrellas', Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n} estrella{n > 1 ? 's' : ''}</option>
              ))}
            </Select>
          </div>
          <Input
            contentLabel="Precio por noche (USD)"
            type="number"
            min={0}
            value={form.precioPorNoche}
            onChange={(e) => actualizar('precioPorNoche', Number(e.target.value))}
          />
          <div className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-2.5 sm:col-span-2">
            <span className="font-semibold text-[#1A2B4C]">Hotel activo en la plataforma</span>
            <Toggle checked={form.activo} onChange={(v) => actualizar('activo', v)} />
          </div>
        </div>
      </div>

      {/* Habitaciones y disponibilidad */}
      {hotel.habitaciones && hotel.habitaciones.length > 0 && (
        <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-5">
          <h2 className="text-secondary font-semibold">Habitaciones y disponibilidad</h2>
          <div className="flex flex-col divide-y divide-black/10">
            {hotel.habitaciones.map((hab) => (
              <div key={hab.id} className="flex items-center gap-4 py-3">
                <img src={hab.imageUrl} alt={hab.nombre} className="h-12 w-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="text-secondary font-semibold">{hab.nombre}</p>
                  <p className="text-sm text-[#44474E]">
                    {formatCurrency(hab.precioPorNoche)} / noche · Capacidad: {hab.capacidad}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#44474E]">
                    {disponibilidad[hab.id] ? 'Disponible' : 'No disponible'}
                  </span>
                  <Toggle
                    checked={disponibilidad[hab.id] ?? true}
                    onChange={(v) => {
                      setDisponibilidad((prev) => ({ ...prev, [hab.id]: v }));
                      setGuardado(false);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guardar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {guardado && (
          <p className="flex items-center gap-1 text-sm font-semibold text-green-700">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            Cambios guardados (simulado, sin backend todavía)
          </p>
        )}
        <Button variant="primary" className="bg-primary text-white sm:ml-auto" onClick={guardarCambios}>
          Guardar cambios
        </Button>
      </div>

      {/* Huéspedes de mi hotel */}
      <div className="flex flex-col gap-4">
        <PageHeader title="Huéspedes de mi hotel" description="Cuentas de huéspedes que reservaron en tu hotel." />

        <SearchFilterBar
          searchValue={searchHuesped}
          onSearchChange={setSearchHuesped}
          placeholder="Buscar por nombre o email..."
        >
          <Select
            value={estadoHuespedFiltro}
            onChange={(e) => setEstadoHuespedFiltro(e.target.value)}
            containerClassName="w-full md:w-40"
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="bloqueado">Bloqueado</option>
          </Select>
        </SearchFilterBar>

        {loadingHuespedes ? (
          <p className="p-6 text-center text-[#44474E]">Cargando huéspedes...</p>
        ) : (
          <DataTable
            columns={columnsHuespedes}
            data={huespedesFiltrados}
            keyExtractor={(h) => h.id}
            emptyMessage="No encontramos huéspedes con esos filtros."
          />
        )}

        <p className="text-xs text-[#44474E]">
          Nota: sin backend todavía, dar de alta/baja a un huésped solo cambia el estado en
          memoria — se pierde al recargar la página.
        </p>
      </div>
    </div>
  );
};
