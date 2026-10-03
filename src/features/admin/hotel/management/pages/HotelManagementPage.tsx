import { AdminInput, Badge, PageHeader, Select, Switch } from '@/components/admin';
import { Button } from '@/components/ui/Button';
import { HOTEL_TYPES, type HotelInfo, type HotelType } from '../../shared/hotel.types';
import { formatUsd } from '../../shared/hotel.utils';
import { useHotelManagement } from '../hooks/useHotelManagement';

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-5">
    <h2 className="text-secondary font-semibold">{title}</h2>
    {children}
  </div>
);

export const HotelManagementPage = () => {
  const {
    hotel,
    form,
    rooms,
    isLoading,
    isSaving,
    saved,
    hasChanges,
    updateField,
    updateRoom,
    handleSave,
    handleDiscard,
  } = useHotelManagement();

  if (!hotel || !form) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Gestión de mi hotel" />
        <p className="text-sm text-[#44474E]">{isLoading ? 'Cargando hotel...' : 'Sin datos.'}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Gestión de mi hotel"
        description="Administra la información y la disponibilidad de tu hotel."
        actions={
          <Badge tone={form.activo ? 'success' : 'danger'}>
            {form.activo ? 'Activo' : 'Inactivo'}
          </Badge>
        }
      />

      <Card title="Información general">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminInput
            contentLabel="Nombre"
            value={form.nombre}
            onChange={(e) => updateField('nombre', e.target.value)}
          />
          <AdminInput
            contentLabel="Ciudad"
            value={form.ciudad}
            onChange={(e) => updateField('ciudad', e.target.value)}
          />
          <AdminInput
            contentLabel="País"
            value={form.pais}
            onChange={(e) => updateField('pais', e.target.value)}
          />
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-[#1A2B4C]">Tipo</span>
            <Select
              value={form.tipo}
              onChange={(e) => updateField('tipo', e.target.value as HotelType)}
            >
              {HOTEL_TYPES.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-[#1A2B4C]">Estrellas</span>
            <Select
              value={form.estrellas}
              onChange={(e) =>
                updateField('estrellas', Number(e.target.value) as HotelInfo['estrellas'])
              }
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} estrella{n > 1 ? 's' : ''}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-2.5 sm:self-end">
            <span className="font-semibold text-[#1A2B4C]">Hotel activo en la plataforma</span>
            <Switch
              checked={form.activo}
              onChange={(value) => updateField('activo', value)}
              aria-label="Hotel activo en la plataforma"
            />
          </div>
        </div>
      </Card>

      <Card title="Habitaciones y disponibilidad">
        <div className="flex flex-col divide-y divide-black/10">
          {hotel.rooms.map((room) => {
            const draft = rooms.find((r) => r.id === room.id);
            if (!draft) return null;
            return (
              <div
                key={room.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-4"
              >
                <img
                  src={room.imageUrl}
                  alt={room.nombre}
                  className="h-14 w-20 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-secondary font-semibold">{room.nombre}</p>
                  <p className="text-sm text-[#44474E]">
                    Capacidad: {room.capacidad} · {room.unidades} habitaciones ·{' '}
                    {formatUsd(draft.precioPorNoche)} / noche
                  </p>
                </div>
                <AdminInput
                  contentLabel="Precio por noche (USD)"
                  type="number"
                  min={0}
                  containerClassname="sm:w-52"
                  value={draft.precioPorNoche || ''}
                  onChange={(e) => updateRoom(room.id, { precioPorNoche: Number(e.target.value) })}
                />
                <div className="flex items-center gap-3 sm:w-44 sm:justify-end">
                  <span className="text-sm text-[#44474E]">
                    {draft.disponible ? 'Disponible' : 'No disponible'}
                  </span>
                  <Switch
                    checked={draft.disponible}
                    onChange={(value) => updateRoom(room.id, { disponible: value })}
                    aria-label={`Disponibilidad de ${room.nombre}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-1 text-sm font-semibold text-green-700">
          {saved && (
            <>
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              Cambios guardados
            </>
          )}
        </p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="w-auto px-4"
            onClick={handleDiscard}
            disabled={!hasChanges || isSaving}
          >
            Descartar
          </Button>
          <Button
            variant="primary"
            className="w-auto px-4"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </div>
    </div>
  );
};
