import { useState } from 'react';
import { PageHeader, SearchFilterBar, Select, DataTable, Badge, ActionsMenu, type TableColumn } from '../../../components/admin';
import { useHotelGuests, type HotelGuest } from '../hooks/useHotelGuests';

const MI_HOTEL_ID = 1;

export const AdminHotelGuestsPage = () => {
  const { huespedes, loading, toggleEstado } = useHotelGuests(MI_HOTEL_ID);
  const [search, setSearch] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');

  const huespedesFiltrados = huespedes.filter((h) => {
    const coincideBusqueda =
      search.trim() === '' ||
      h.nombre.toLowerCase().includes(search.toLowerCase()) ||
      h.email.toLowerCase().includes(search.toLowerCase());
    const coincideEstado = estadoFiltro === 'todos' || h.estado === estadoFiltro;
    return coincideBusqueda && coincideEstado;
  });

  const columns: TableColumn<HotelGuest>[] = [
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
    { key: 'fechaRegistro', header: 'Registrado', render: (h) => h.fechaRegistro },
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
      render: (h) => (
        <ActionsMenu
          menuActions={[
            h.estado === 'activo'
              ? { label: 'Bloquear cuenta', icon: 'block', tone: 'danger', onClick: () => toggleEstado(h.id) }
              : { label: 'Reactivar cuenta', icon: 'check_circle', onClick: () => toggleEstado(h.id) },
            { label: 'Enviar email', icon: 'mail', onClick: () => window.open(`mailto:${h.email}`) },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Usuarios"
        description="Cuentas de huéspedes que reservaron en tu hotel. Podés dar de alta o bloquear una cuenta."
      />

      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Buscar por nombre o email..."
      >
        <Select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          containerClassName="w-full md:w-40"
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="bloqueado">Bloqueado</option>
        </Select>
      </SearchFilterBar>

      {loading ? (
        <p className="p-6 text-center text-[#44474E]">Cargando huéspedes...</p>
      ) : (
        <DataTable
          columns={columns}
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
  );
};
