import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { useAeropuerto } from '@/hooks/useAPI';
import { cn } from '@/utils/cn';
import { Card, Check, SelectField, TextField } from '@/features/profile/components/FormParts';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { ProfilePhotoModal } from '@/features/profile/components/ProfilePhotoModal';
import type { Profile } from '@/features/profile/profile.types';
import { useProfile } from '@/features/profile/hooks/useProfile';

const provincias = [
  'Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Ciudad Autónoma de Buenos Aires',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
];

/** Datos que vienen de la cuenta: se muestran pero no se editan acá. */
const SOLO_LECTURA = 'bg-gray-100 text-gray-500';

const SELECCIONA = { value: '', label: 'Seleccioná…' };

const generos = ['Femenino', 'Masculino', 'No binario', 'Prefiero no decirlo'];
const asientos = ['Sin preferencia', 'Ventana', 'Pasillo'];
const comidas = ['Sin preferencia', 'Vegetariana', 'Vegana', 'Sin TACC (celíaca)', 'Sin lactosa'];

type Errores = Partial<Record<keyof Profile, string>>;

const validar = (p: Profile): Errores => {
  const errores: Errores = {};
  if (!p.nombre.trim()) errores.nombre = 'Ingresá tu nombre';
  if (!p.apellido.trim()) errores.apellido = 'Ingresá tu apellido';
  if (!/^\S+@\S+\.\S+$/.test(p.email)) errores.email = 'Ingresá un correo válido';
  if (!p.numeroDocumento.trim()) errores.numeroDocumento = 'Ingresá tu número de documento';
  if (p.telefono && !/^[+\d][\d\s()-]{6,}$/.test(p.telefono)) {
    errores.telefono = 'Ingresá un teléfono válido';
  }
  return errores;
};

export const MyDataPage = () => {
  const { profile, saveProfile } = useProfile();
  const { aeropuertos } = useAeropuerto();
  const [draft, setDraft] = useState<Profile>(profile);
  const [errores, setErrores] = useState<Errores>({});
  const [guardado, setGuardado] = useState(false);
  const [fotoModalAbierto, setFotoModalAbierto] = useState(false);

  const cambiar = <K extends keyof Profile>(campo: K, valor: Profile[K]) => {
    setDraft((prev) => ({ ...prev, [campo]: valor }));
    setGuardado(false);
  };

  const texto = (campo: keyof Profile) => ({
    value: String(draft[campo]),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => cambiar(campo, e.target.value as never),
    error: errores[campo],
  });

  const guardar = (e: FormEvent) => {
    e.preventDefault();
    const nuevos = validar(draft);
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;
    saveProfile({
      ...draft,
      nombre: draft.nombre.trim(),
      apellido: draft.apellido.trim(),
    });
    setGuardado(true);
  };

  const descartar = () => {
    setDraft(profile);
    setErrores({});
    setGuardado(false);
  };

  const iniciales =
    `${draft.nombre.trim()[0] ?? ''}${draft.apellido.trim()[0] ?? ''}`.toUpperCase();

  const hayCambios = JSON.stringify(draft) !== JSON.stringify(profile);

  return (
    <form onSubmit={guardar} noValidate className="flex flex-col gap-5">
      <div className="bg-secondary relative flex min-h-32 flex-col justify-center overflow-hidden rounded-2xl px-6 py-8 sm:min-h-40 sm:px-11 sm:py-10">
        <div className="pointer-events-none absolute top-1/2 -right-7.5 h-85 w-85 -translate-y-1/2 rounded-full bg-white/3" />
        <h1 className="relative z-10 mb-2 text-2xl font-extrabold text-white sm:text-3xl">
          Mis datos
        </h1>
        <p className="relative z-10 text-sm font-medium text-white/65 sm:text-[15px]">
          Mantené tu información al día para comprar más rápido. Tus datos personales se usan como
          pasajero 1 en cada reserva.
        </p>
      </div>

      <ProfileHeader
        foto={draft.foto}
        iniciales={iniciales}
        nombreCompleto={`${draft.nombre} ${draft.apellido}`.trim()}
        email={draft.email}
        onEditPhoto={() => setFotoModalAbierto(true)}
      />

      <Card title="Datos personales" icon="person">
        <TextField contentLabel="Nombre" {...texto('nombre')} readOnly className={SOLO_LECTURA} />
        <TextField
          contentLabel="Apellido"
          {...texto('apellido')}
          readOnly
          className={SOLO_LECTURA}
        />
        <TextField contentLabel="Fecha de nacimiento" type="date" {...texto('fechaNacimiento')} />
        <SelectField
          label="Género"
          value={draft.genero}
          options={[SELECCIONA, ...generos.map((g) => ({ value: g, label: g }))]}
          onChange={(v) => cambiar('genero', v)}
        />
        <TextField contentLabel="Nacionalidad" {...texto('nacionalidad')} />
        <div className="grid grid-cols-[130px_1fr] gap-3">
          <SelectField
            label="Documento"
            value={draft.tipoDocumento}
            options={[
              { value: 'DNI', label: 'DNI' },
              { value: 'Pasaporte', label: 'Pasaporte' },
            ]}
            onChange={(v) => cambiar('tipoDocumento', v as Profile['tipoDocumento'])}
          />
          <TextField contentLabel="Número" {...texto('numeroDocumento')} />
        </div>
      </Card>

      <Card title="Contacto" icon="mail">
        <TextField
          contentLabel="Correo electrónico"
          type="email"
          {...texto('email')}
          readOnly
          className={SOLO_LECTURA}
        />
        <TextField contentLabel="Teléfono" type="tel" {...texto('telefono')} />
      </Card>

      <Card title="Domicilio" icon="home">
        <SelectField
          label="Provincia"
          value={draft.provincia}
          options={[SELECCIONA, ...provincias.map((p) => ({ value: p, label: p }))]}
          onChange={(v) => cambiar('provincia', v)}
        />
        <TextField contentLabel="Ciudad" {...texto('ciudad')} />
        <TextField contentLabel="Calle y número" {...texto('direccion')} />
        <TextField contentLabel="Código postal" {...texto('codigoPostal')} />
      </Card>

      <Card title="Preferencias de viaje" icon="flight">
        <SelectField
          label="Asiento preferido"
          value={draft.asientoPreferido}
          options={asientos.map((a) => ({ value: a, label: a }))}
          onChange={(v) => cambiar('asientoPreferido', v)}
        />
        <SelectField
          label="Preferencia de comida"
          value={draft.comida}
          options={comidas.map((c) => ({ value: c, label: c }))}
          onChange={(v) => cambiar('comida', v)}
        />
        <SelectField
          label="Aeropuerto de salida habitual"
          value={draft.aeropuertoOrigen}
          options={[
            SELECCIONA,
            ...aeropuertos.map((a) => ({
              value: a.code,
              label: `${a.city} (${a.code})`,
            })),
          ]}
          onChange={(v) => cambiar('aeropuertoOrigen', v)}
        />
        <TextField
          contentLabel="N° de pasajero frecuente (programa de millas)"
          placeholder="Opcional"
          {...texto('numeroMillas')}
        />
        <div className="sm:col-span-2">
          <Check
            checked={draft.asistenciaEspecial}
            onChange={(v) => cambiar('asistenciaEspecial', v)}
          >
            Necesito asistencia especial en el aeropuerto (movilidad reducida, menores, etc.)
          </Check>
        </div>
      </Card>

      <Card title="Contacto de emergencia" icon="emergency">
        <TextField contentLabel="Nombre y apellido" {...texto('emergenciaNombre')} />
        <TextField contentLabel="Teléfono" type="tel" {...texto('emergenciaTelefono')} />
      </Card>

      {guardado && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-[14px] border-[1.5px] border-[#a5d6a7] bg-[#f0fdf4] px-5 py-4 text-sm font-bold text-[#15803d]"
        >
          <span className="material-symbols-outlined">check_circle</span>
          Tus datos se guardaron correctamente.
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          className={cn('sm:w-auto sm:px-8', !hayCambios && 'pointer-events-none opacity-50')}
          onClick={descartar}
        >
          Descartar cambios
        </Button>
        <Button type="submit" variant="primary" className="bg-primary text-white sm:w-auto sm:px-8">
          Guardar cambios
        </Button>
      </div>
      <ProfilePhotoModal
        isOpen={fotoModalAbierto}
        onClose={() => setFotoModalAbierto(false)}
        foto={draft.foto}
        iniciales={iniciales}
        onPhotoChange={(foto) => cambiar('foto', foto)}
      />
    </form>
  );
};
