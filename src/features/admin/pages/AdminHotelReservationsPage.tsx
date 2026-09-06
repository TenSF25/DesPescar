import { useEffect, useState } from 'react';
import { PageHeader, SearchFilterBar, Select, DataTable, Badge, ActionsMenu, type TableColumn } from '../../../components/admin';
import { formatCurrency } from '../../../utils/formatCurrency';
import type { ReservaHotel, EstadoReserva } from '../../hotels/hotels.types';

const MI_HOTEL_ID = 1;

const ESTADO_LABEL: Record<EstadoReserva, string> = {
  proximo: 'Próxima',
  completado: 'Completada',
  cancelado: 'Cancelada',
};

const ESTADO_TONO: Record<EstadoReserva, 'success' | 'danger' | 'info'> = {
  proximo: 'info',
  completado: 'success',
  cancelado: 'danger',
};

export const AdminHotelReservationsPage = () => {
  const [reservas, setReservas] = useState<ReservaHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');

  useEffect(() => {
    fetch('/json/reservas-hotel.json')
      .then((res) => res.json())
      .then((data: ReservaHotel[]) => setReservas(data.filter((r) => r.hotelId === MI_HOTEL_ID)))
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }, []);

  // Sin backend todavía: cambiar el estado solo actualiza la memoria local.
  const cambiarEstado = (id: number, nuevoEstado: EstadoReserva) => {
    setReservas((prev) => prev.map((r) => (r.id === id ? { ...r, estado: nuevoEstado } : r)));
  };

  const reservasFiltradas = reservas.filter((r) => {
    const coincideBusqueda =
      search.trim() === '' ||
      r.codigoConfirmacion.toLowerCase().includes(search.toLowerCase()) ||
      r.contactEmail.toLowerCase().includes(search.toLowerCase());
    const coincideEstado = estadoFiltro === 'todos' || r.estado === estadoFiltro;
    return coincideBusqueda && coincideEstado;
  });

  const columns: TableColumn<ReservaHotel>[] = [
    {
      key: 'codigo',
      header: 'Código / Huésped',
      render: (r) => (
        <div className="flex flex-col">
          <span className="font-semibold">{r.codigoConfirmacion}</span>
          <span className="text-xs text-[#44474E]">{r.contactEmail}</span>
        </div>
      ),
    },
    { key: 'habitacion', header: 'Habitación', render: (r) => r.habitacionNombre },
    { key: 'fechas', header: 'Check-in / Check-out', render: (r) => `${r.fechaInicio} → ${r.fechaFin}` },
    { key: 'total', header: 'Total', render: (r) => formatCurrency(r.precioTotal) },
    {
      key: 'estado',
      header: 'Estado',
      render: (r) => <Badge tone={ESTADO_TONO[r.estado]}>{ESTADO_LABEL[r.estado]}</Badge>,
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (r) => (
        <ActionsMenu
          onEdit={
            r.estado === 'proximo' ? () => cambiarEstado(r.id, 'completado') : undefined
          }
          onMore={
            r.estado !== 'cancelado' ? () => cambiarEstado(r.id, 'cancelado') : undefined
          }
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reservas"
        description="Gestioná las reservas de tu hotel: marcá como completadas o cancelalas."
      />

      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Buscar por código o email..."
      >
        <Select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          containerClassName="w-full md:w-44"
        >
          <option value="todos">Todos los estados</option>
          <option value="proximo">Próxima</option>
          <option value="completado">Completada</option>
          <option value="cancelado">Cancelada</option>
        </Select>
      </SearchFilterBar>

      {loading ? (
        <p className="p-6 text-center text-[#44474E]">Cargando reservas...</p>
      ) : (
        <DataTable
          columns={columns}
          data={reservasFiltradas}
          keyExtractor={(r) => r.id}
          emptyMessage="No encontramos reservas con esos filtros."
        />
      )}

      <p className="text-xs text-[#44474E]">
        Nota: sin backend todavía, marcar como completada/cancelada solo cambia el estado en
        memoria — se pierde al recargar la página. El ícono de lápiz marca "Completada", el de
        más opciones (⋮) marca "Cancelada".
      </p>
    </div>
  );
};
