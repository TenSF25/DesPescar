import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, StatCard, ChartCard, DonutChart, LineChart, Select } from '../../../components/admin';
import { Button } from '../../../components/ui/Button';
import { formatCurrency } from '../../../utils/formatCurrency';
import type { Hotel, ReservaHotel } from '../../hotels/hotels.types';

// TODO: cuando exista login real, sale de la sesión (igual que en AdminHotelsPage).
const MI_HOTEL_ID = 1;

const MESES_CORTOS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

type Periodo = 'todo' | '3meses' | 'anio';

const dentroDelPeriodo = (fechaISO: string, periodo: Periodo) => {
  if (periodo === 'todo') return true;
  const fecha = new Date(`${fechaISO}T00:00:00`);
  const ahora = new Date();
  if (periodo === 'anio') return fecha.getFullYear() === ahora.getFullYear();
  const limite = new Date(ahora);
  limite.setMonth(limite.getMonth() - 3);
  return fecha >= limite;
};

const calcularPorDia = (reservas: ReservaHotel[]) => {
  const conteo = new Map<string, number>();
  reservas.forEach((r) => {
    conteo.set(r.fechaInicio, (conteo.get(r.fechaInicio) ?? 0) + 1);
  });
  return Array.from(conteo.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([fecha, value]) => {
      const [, mes, dia] = fecha.split('-');
      return { label: `${dia} ${MESES_CORTOS[Number(mes) - 1]}`, value };
    });
};

const calcularPorMes = (reservas: ReservaHotel[]) => {
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

const COLORES_HABITACION = ['#1f3051', '#3457a6', '#6f8fd6', '#a9bdec', '#c85300'];

const calcularIngresosPorHabitacion = (reservas: ReservaHotel[]) => {
  const conteo = new Map<string, number>();
  reservas
    .filter((r) => r.estado !== 'cancelado')
    .forEach((r) => {
      conteo.set(r.habitacionNombre, (conteo.get(r.habitacionNombre) ?? 0) + r.precioTotal);
    });
  return Array.from(conteo.entries()).map(([label, value], i) => ({
    label,
    value,
    color: COLORES_HABITACION[i % COLORES_HABITACION.length],
  }));
};

/** Arma y descarga un CSV real con las reservas visibles (sin backend: 100% en el navegador). */
const exportarCSV = (reservas: ReservaHotel[], nombreHotel: string) => {
  const encabezado = ['Codigo', 'Habitacion', 'Check-in', 'Check-out', 'Estado', 'Total (USD)'];
  const filas = reservas.map((r) => [
    r.codigoConfirmacion,
    r.habitacionNombre,
    r.fechaInicio,
    r.fechaFin,
    r.estado,
    r.precioTotal.toString(),
  ]);

  const csv = [encabezado, ...filas]
    .map((fila) => fila.map((celda) => `"${celda.replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `reservas-${nombreHotel.toLowerCase().replace(/\s+/g, '-')}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const AdminHotelReportsPage = () => {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [reservas, setReservas] = useState<ReservaHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState<Periodo>('todo');
  const [vista, setVista] = useState<'mes' | 'dia'>('mes');

  useEffect(() => {
    Promise.all([
      fetch('/json/hoteles.json').then((res) => res.json()),
      fetch('/json/reservas-hotel.json').then((res) => res.json()),
    ])
      .then(([hoteles, reservasData]: [Hotel[], ReservaHotel[]]) => {
        setHotel(hoteles.find((h) => h.id === MI_HOTEL_ID) ?? null);
        setReservas(reservasData.filter((r) => r.hotelId === MI_HOTEL_ID));
      })
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }, []);

  const reservasEnPeriodo = useMemo(
    () => reservas.filter((r) => dentroDelPeriodo(r.fechaInicio, periodo)),
    [reservas, periodo],
  );

  const serieReservas = useMemo(
    () => (vista === 'mes' ? calcularPorMes(reservasEnPeriodo) : calcularPorDia(reservasEnPeriodo)),
    [reservasEnPeriodo, vista],
  );

  const ingresosPorHabitacion = useMemo(
    () => calcularIngresosPorHabitacion(reservasEnPeriodo),
    [reservasEnPeriodo],
  );

  const ingresosTotales = reservasEnPeriodo
    .filter((r) => r.estado !== 'cancelado')
    .reduce((sum, r) => sum + r.precioTotal, 0);
  const canceladas = reservasEnPeriodo.filter((r) => r.estado === 'cancelado').length;
  const ticketPromedio =
    reservasEnPeriodo.length > 0 ? ingresosTotales / (reservasEnPeriodo.length - canceladas || 1) : 0;

  if (loading || !hotel) {
    return <p className="p-6">Cargando...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/admin/hoteles"
        className="flex w-max items-center gap-1 text-sm text-[#44474E] hover:text-secondary"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Volver a Mi Hotel
      </Link>

      <PageHeader
        title={`Reportes de ${hotel.nombre}`}
        description="Estadísticas y métricas de reservas de tu hotel."
        actions={
          <div className="flex items-center gap-3">
            <Select value={periodo} onChange={(e) => setPeriodo(e.target.value as Periodo)}>
              <option value="todo">Todo el historial</option>
              <option value="anio">Este año</option>
              <option value="3meses">Últimos 3 meses</option>
            </Select>
            <Button
              variant="primary"
              className="bg-primary w-auto text-white"
              onClick={() => exportarCSV(reservasEnPeriodo, hotel.nombre)}
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Exportar CSV
            </Button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="confirmation_number" iconClassName="bg-primary/10 text-primary" label="Reservas en el período" value={reservasEnPeriodo.length} />
        <StatCard icon="payments" iconClassName="bg-orange-100 text-orange-600" label="Ingresos totales" value={formatCurrency(ingresosTotales)} />
        <StatCard icon="trending_up" iconClassName="bg-blue-100 text-blue-600" label="Ticket promedio" value={formatCurrency(Math.round(ticketPromedio))} />
        <StatCard icon="cancel" iconClassName="bg-red-100 text-alert" label="Cancelaciones" value={canceladas} />
      </div>

      {/* Gráfico de reservas con selector mes/día */}
      <div className="min-w-0">
        <ChartCard
          title="Reservas"
          action={
            <div className="flex overflow-hidden rounded-lg border border-black/10 text-sm">
              <button
                onClick={() => setVista('mes')}
                className={`px-3 py-1 ${vista === 'mes' ? 'bg-secondary text-white' : 'text-[#44474E]'}`}
              >
                Por mes
              </button>
              <button
                onClick={() => setVista('dia')}
                className={`px-3 py-1 ${vista === 'dia' ? 'bg-secondary text-white' : 'text-[#44474E]'}`}
              >
                Por día
              </button>
            </div>
          }
        >
          {serieReservas.length === 0 ? (
            <p className="text-sm text-[#44474E]">No hay reservas en este período.</p>
          ) : (
            <LineChart data={serieReservas} />
          )}
        </ChartCard>
      </div>

      {/* Ingresos por tipo de habitación */}
      <div className="min-w-0">
        <ChartCard title="Ingresos por habitación">
          {ingresosPorHabitacion.length === 0 ? (
            <p className="text-sm text-[#44474E]">No hay ingresos en este período.</p>
          ) : (
            <DonutChart data={ingresosPorHabitacion} />
          )}
        </ChartCard>
      </div>

      {/* Detalle de reservas */}
      <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="text-secondary font-semibold">Detalle de reservas del período</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-125 text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 text-[#44474E]">
                <th className="py-2 pr-4">Código</th>
                <th className="py-2 pr-4">Habitación</th>
                <th className="py-2 pr-4">Check-in</th>
                <th className="py-2 pr-4">Estado</th>
                <th className="py-2 pr-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {reservasEnPeriodo.map((r) => (
                <tr key={r.id} className="border-b border-black/5">
                  <td className="py-2 pr-4">{r.codigoConfirmacion}</td>
                  <td className="py-2 pr-4">{r.habitacionNombre}</td>
                  <td className="py-2 pr-4">{r.fechaInicio}</td>
                  <td className="py-2 pr-4 capitalize">{r.estado}</td>
                  <td className="py-2 pr-4 text-right">{formatCurrency(r.precioTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
