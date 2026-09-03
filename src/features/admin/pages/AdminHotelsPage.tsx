import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageHeader,
  StatCard,
  ChartCard,
  DonutChart,
  ActivityListItem,
  SearchFilterBar,
  Select,
  DataTable,
  Badge,
  ActionsMenu,
  Pagination,
  type TableColumn,
} from '../../../components/admin';
import { formatCurrency } from '../../../utils/formatCurrency';
import type { Hotel, ReservaHotel } from '../../hotels/hotels.types';

const ITEMS_POR_PAGINA = 5;

const TIPOS_HOTEL = ['Boutique', 'Resort All-Inclusive', 'Negocios', 'Apartamentos'];

const COLORES_TIPO: Record<string, string> = {
  Boutique: '#1f3051',
  'Resort All-Inclusive': '#3457a6',
  Negocios: '#6f8fd6',
  Apartamentos: '#a9bdec',
};

const ACTIVIDAD_INFO: Record<
  ReservaHotel['estado'],
  { icon: string; iconClassName: string; titulo: string }
> = {
  proximo: { icon: 'event_available', iconClassName: 'bg-blue-100 text-blue-600', titulo: 'Nueva reserva realizada' },
  completado: { icon: 'task_alt', iconClassName: 'bg-green-100 text-green-600', titulo: 'Estadía completada' },
  cancelado: { icon: 'cancel', iconClassName: 'bg-red-100 text-alert', titulo: 'Reserva cancelada' },
};

export const AdminHotelsPage = () => {
  const navigate = useNavigate();

  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [reservas, setReservas] = useState<ReservaHotel[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('todos');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [page, setPage] = useState(1);

  useEffect(() => {
    Promise.all([
      fetch('/json/hoteles.json').then((res) => res.json()),
      fetch('/json/reservas-hotel.json').then((res) => res.json()),
    ])
      .then(([hotelesData, reservasData]) => {
        setHoteles(hotelesData);
        setReservas(reservasData);
      })
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }, []);

  const hotelesFiltrados = useMemo(() => {
    return hoteles.filter((h) => {
      const coincideBusqueda =
        search.trim() === '' ||
        h.nombre.toLowerCase().includes(search.toLowerCase()) ||
        h.ciudad.toLowerCase().includes(search.toLowerCase());
      const coincideTipo = tipoFiltro === 'todos' || h.tipo === tipoFiltro;
      const coincideEstado =
        estadoFiltro === 'todos' ||
        (estadoFiltro === 'activo' && h.activo !== false) ||
        (estadoFiltro === 'inactivo' && h.activo === false);
      return coincideBusqueda && coincideTipo && coincideEstado;
    });
  }, [hoteles, search, tipoFiltro, estadoFiltro]);

  const totalPaginas = Math.max(1, Math.ceil(hotelesFiltrados.length / ITEMS_POR_PAGINA));
  const hotelesPagina = hotelesFiltrados.slice(
    (page - 1) * ITEMS_POR_PAGINA,
    page * ITEMS_POR_PAGINA,
  );

  // KPIs calculados a partir de los datos reales (no números fijos)
  const totalHoteles = hoteles.length;
  const hotelesActivos = hoteles.filter((h) => h.activo !== false).length;
  const reservasActivas = reservas.filter((r) => r.estado !== 'cancelado').length;
  const ingresosTotales = reservas
    .filter((r) => r.estado !== 'cancelado')
    .reduce((sum, r) => sum + r.precioTotal, 0);

  // Distribución por tipo de hotel, para el donut
  const distribucionTipo = TIPOS_HOTEL.map((tipo) => ({
    label: tipo,
    value: hoteles.filter((h) => h.tipo === tipo).length,
    color: COLORES_TIPO[tipo],
  })).filter((d) => d.value > 0);

  const columns: TableColumn<Hotel>[] = [
    {
      key: 'hotel',
      header: 'Hotel / Ubicación',
      render: (h) => (
        <div className="flex items-center gap-3">
          <img src={h.imageUrl} alt={h.nombre} className="h-10 w-10 rounded-lg object-cover" />
          <div className="flex flex-col">
            <span className="font-semibold">{h.nombre}</span>
            <span className="text-xs text-[#44474E]">
              {h.ciudad}, {h.pais}
            </span>
          </div>
        </div>
      ),
    },
    { key: 'tipo', header: 'Tipo', render: (h) => h.tipo },
    {
      key: 'estrellas',
      header: 'Estrellas',
      render: (h) => (
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`material-symbols-outlined text-[16px]! ${
                i < h.estrellas ? 'text-primary' : 'text-black/20'
              }`}
            >
              star
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'precio',
      header: 'Precio / Noche',
      render: (h) => formatCurrency(h.precioPorNoche),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (h) => (
        <Badge tone={h.activo !== false ? 'success' : 'danger'}>
          {h.activo !== false ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (h) => (
        <ActionsMenu
          onView={() => navigate(`/hotels/${h.id}`)}
          onEdit={() => {}}
          onMore={() => {}}
        />
      ),
    },
  ];

  const actividadReciente = reservas.slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Gestión de Hoteles"
        description="Administra los hoteles registrados en la plataforma."
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="hotel"
          iconClassName="bg-primary/10 text-primary"
          label="Total de hoteles"
          value={totalHoteles}
        />
        <StatCard
          icon="check_circle"
          iconClassName="bg-green-100 text-green-600"
          label="Hoteles activos"
          value={hotelesActivos}
        />
        <StatCard
          icon="confirmation_number"
          iconClassName="bg-blue-100 text-blue-600"
          label="Reservas activas"
          value={reservasActivas}
        />
        <StatCard
          icon="payments"
          iconClassName="bg-orange-100 text-orange-600"
          label="Ingresos totales"
          value={formatCurrency(ingresosTotales)}
        />
      </div>

      {/* Gráfico + actividad reciente */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ChartCard title="Hoteles por tipo">
            <DonutChart data={distribucionTipo} />
          </ChartCard>
        </div>

        <div className="lg:col-span-2">
          <ChartCard title="Actividad reciente">
            <div className="flex flex-col gap-4">
              {actividadReciente.map((r) => {
                const info = ACTIVIDAD_INFO[r.estado];
                return (
                  <ActivityListItem
                    key={r.id}
                    icon={info.icon}
                    iconClassName={info.iconClassName}
                    title={info.titulo}
                    subtitle={`${r.hotelNombre} · ${r.codigoConfirmacion}`}
                    time={r.fechaInicio}
                  />
                );
              })}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Tabla */}
      <div className="flex flex-col gap-4">
        <SearchFilterBar
          searchValue={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Buscar hotel o ciudad..."
        >
          <Select
            value={tipoFiltro}
            onChange={(e) => {
              setTipoFiltro(e.target.value);
              setPage(1);
            }}
            containerClassName="w-full md:w-48"
          >
            <option value="todos">Todos los tipos</option>
            {TIPOS_HOTEL.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </Select>
          <Select
            value={estadoFiltro}
            onChange={(e) => {
              setEstadoFiltro(e.target.value);
              setPage(1);
            }}
            containerClassName="w-full md:w-40"
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </Select>
        </SearchFilterBar>

        {loading ? (
          <p className="p-6 text-center text-[#44474E]">Cargando hoteles...</p>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={hotelesPagina}
              keyExtractor={(h) => h.id}
              emptyMessage="No encontramos hoteles con esos filtros."
            />

            <Pagination
              currentPage={page}
              totalPages={totalPaginas}
              onPageChange={setPage}
              totalItems={hotelesFiltrados.length}
              itemsPerPage={ITEMS_POR_PAGINA}
              itemLabel="hoteles"
            />
          </>
        )}
      </div>
    </div>
  );
};
