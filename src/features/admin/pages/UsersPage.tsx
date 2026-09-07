import { useMemo, useState } from 'react';
import {
  PageHeader,
  SearchFilterBar,
  Select,
  DataTable,
  Badge,
  Pagination,
  type TableColumn,
  type BadgeTone,
} from '../../../components/admin';

/**
 * Gestión de usuarios de la plataforma: acá es donde el admin general da
 * de alta/baja aerolíneas, hoteles y clientes, aprueba solicitudes
 * pendientes y suspende cuentas. El Dashboard (/admin) es de solo lectura;
 * la gestión real vive acá.
 */

type TipoCuenta = 'Aerolínea' | 'Hotel' | 'Cliente';
type EstadoCuenta = 'Activo' | 'Pendiente' | 'Suspendido';

interface CuentaPlataforma {
  id: number;
  nombre: string;
  email: string;
  tipo: TipoCuenta;
  fechaAlta: string;
  estado: EstadoCuenta;
}

const cuentasIniciales: CuentaPlataforma[] = [
  {
    id: 1,
    nombre: 'Aerolíneas del Sur',
    email: 'contacto@aerolineasdelsur.com',
    tipo: 'Aerolínea',
    fechaAlta: '05 Sep 2026',
    estado: 'Pendiente',
  },
  {
    id: 2,
    nombre: 'Hotel Costanera',
    email: 'reservas@hotelcostanera.com',
    tipo: 'Hotel',
    fechaAlta: '04 Sep 2026',
    estado: 'Activo',
  },
  {
    id: 3,
    nombre: 'Martina Suárez',
    email: 'martina.suarez@email.com',
    tipo: 'Cliente',
    fechaAlta: '04 Sep 2026',
    estado: 'Activo',
  },
  {
    id: 4,
    nombre: 'Vuela Andes',
    email: 'admin@vuelaandes.com',
    tipo: 'Aerolínea',
    fechaAlta: '02 Sep 2026',
    estado: 'Suspendido',
  },
  {
    id: 5,
    nombre: 'Hotel Bahía Norte',
    email: 'info@hotelbahianorte.com',
    tipo: 'Hotel',
    fechaAlta: '01 Sep 2026',
    estado: 'Pendiente',
  },
];

const estadoTone: Record<EstadoCuenta, BadgeTone> = {
  Activo: 'success',
  Pendiente: 'warning',
  Suspendido: 'danger',
};

const tipoTone: Record<TipoCuenta, BadgeTone> = {
  Aerolínea: 'dark',
  Hotel: 'info',
  Cliente: 'neutral',
};

const filtroToTipo: Record<string, TipoCuenta | null> = {
  todos: null,
  aerolinea: 'Aerolínea',
  hotel: 'Hotel',
  cliente: 'Cliente',
};

/** Botón de texto chico, propio de esta tabla (alta/baja no es un ícono genérico). */
const AccionTexto = ({
  label,
  tone,
  onClick,
}: {
  label: string;
  tone: 'positive' | 'negative';
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={
      tone === 'positive'
        ? 'cursor-pointer text-xs font-semibold text-green-700 hover:underline'
        : 'text-alert cursor-pointer text-xs font-semibold hover:underline'
    }
  >
    {label}
  </button>
);

export const UsersPage = () => {
  const [cuentas, setCuentas] = useState(cuentasIniciales);
  const [search, setSearch] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [page, setPage] = useState(1);

  const cuentasFiltradas = useMemo(() => {
    const tipoBuscado = filtroToTipo[filtro];
    return cuentas.filter((c) => {
      const coincideTipo = !tipoBuscado || c.tipo === tipoBuscado;
      const coincideBusqueda =
        !search ||
        c.nombre.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());
      return coincideTipo && coincideBusqueda;
    });
  }, [cuentas, search, filtro]);

  const cambiarEstado = (id: number, nuevoEstado: EstadoCuenta) => {
    setCuentas((prev) => prev.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c)));
  };

  const columns: TableColumn<CuentaPlataforma>[] = [
    {
      key: 'nombre',
      header: 'Cuenta',
      render: (c) => (
        <div className="flex flex-col">
          <span className="font-semibold">{c.nombre}</span>
          <span className="text-xs text-[#44474E]">{c.email}</span>
        </div>
      ),
    },
    {
      key: 'tipo',
      header: 'Tipo',
      render: (c) => <Badge tone={tipoTone[c.tipo]}>{c.tipo}</Badge>,
    },
    {
      key: 'fechaAlta',
      header: 'Fecha de alta',
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (c) => <Badge tone={estadoTone[c.estado]}>{c.estado}</Badge>,
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (c) => (
        <div className="flex items-center gap-4">
          {c.estado === 'Pendiente' && (
            <>
              <AccionTexto
                label="Aprobar"
                tone="positive"
                onClick={() => cambiarEstado(c.id, 'Activo')}
              />
              <AccionTexto
                label="Rechazar"
                tone="negative"
                onClick={() => cambiarEstado(c.id, 'Suspendido')}
              />
            </>
          )}
          {c.estado === 'Activo' && (
            <AccionTexto
              label="Suspender"
              tone="negative"
              onClick={() => cambiarEstado(c.id, 'Suspendido')}
            />
          )}
          {c.estado === 'Suspendido' && (
            <AccionTexto
              label="Reactivar"
              tone="positive"
              onClick={() => cambiarEstado(c.id, 'Activo')}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Usuarios"
        description="Altas, bajas y permisos de aerolíneas, hoteles y clientes."
        actions={
          <button
            type="button"
            className="bg-secondary hover:bg-secondary/90 flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nueva cuenta
          </button>
        }
      />

      <div className="flex flex-col gap-4">
        <SearchFilterBar
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Buscar por nombre o email..."
        >
          <Select
            value={filtro}
            onChange={(e) => {
              setFiltro(e.target.value);
              setPage(1);
            }}
            containerClassName="w-full md:w-48"
          >
            <option value="todos">Todos los tipos</option>
            <option value="aerolinea">Aerolíneas</option>
            <option value="hotel">Hoteles</option>
            <option value="cliente">Clientes</option>
          </Select>
        </SearchFilterBar>

        <DataTable
          columns={columns}
          data={cuentasFiltradas}
          keyExtractor={(c) => c.id}
          emptyMessage="No se encontraron cuentas con ese criterio."
        />

        <Pagination
          currentPage={page}
          totalPages={1}
          onPageChange={setPage}
          totalItems={cuentasFiltradas.length}
          itemsPerPage={5}
          itemLabel="cuentas"
        />
      </div>
    </div>
  );
};
