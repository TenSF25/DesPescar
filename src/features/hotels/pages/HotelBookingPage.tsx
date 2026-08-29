import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Section } from '../../../components/ui/Section';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { formatCurrency } from '../../../utils/formatCurrency';
import { useHotelDetail } from '../hooks/useHotelDetail';

interface DatosHuesped {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  checkIn: string;
  checkOut: string;
  huespedes: number;
  solicitudes: string;
}

interface DatosPago {
  nombreTarjeta: string;
  numeroTarjeta: string;
  vencimiento: string;
  cvv: string;
}

const DATOS_HUESPED_INICIALES: DatosHuesped = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  checkIn: '',
  checkOut: '',
  huespedes: 1,
  solicitudes: '',
};

const DATOS_PAGO_INICIALES: DatosPago = {
  nombreTarjeta: '',
  numeroTarjeta: '',
  vencimiento: '',
  cvv: '',
};

const MESES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

const formatFechaCorta = (fechaISO: string) => {
  if (!fechaISO) return '—';
  const fecha = new Date(`${fechaISO}T00:00:00`);
  return `${fecha.getDate()} ${MESES[fecha.getMonth()]}, ${fecha.getFullYear()}`;
};

const calcularNoches = (checkIn: string, checkOut: string) => {
  if (!checkIn || !checkOut) return 0;
  const diffMs = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  const noches = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return noches > 0 ? noches : 0;
};

const validarEmail = (valor: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

const validarTelefono = (valor: string) => {
  const soloDigitos = valor.replace(/\D/g, '');
  return /^[0-9+\-\s()]+$/.test(valor) && soloDigitos.length >= 8;
};

const validarNumeroTarjeta = (valor: string) => {
  const soloDigitos = valor.replace(/\s/g, '');
  return /^\d{13,19}$/.test(soloDigitos);
};

const validarVencimiento = (valor: string) => /^(0[1-9]|1[0-2])\/20\d{2}$/.test(valor);

const validarCVV = (valor: string) => /^\d{3,4}$/.test(valor);

export const HotelBookingPage = () => {
  const { id, roomId } = useParams<{ id: string; roomId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { hotel, loading, notFound } = useHotelDetail();

  const [huesped, setHuesped] = useState<DatosHuesped>(() => ({
    ...DATOS_HUESPED_INICIALES,
    checkIn: searchParams.get('checkIn') ?? '',
    checkOut: searchParams.get('checkOut') ?? '',
    huespedes: Number(searchParams.get('huespedes')) || 1,
  }));
  const [pago, setPago] = useState<DatosPago>(DATOS_PAGO_INICIALES);
  const [errores, setErrores] = useState<Record<string, string | undefined>>({});
  const [reservaConfirmada, setReservaConfirmada] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  if (loading) {
    return (
      <Section>
        <p className="p-6">Cargando...</p>
      </Section>
    );
  }

  const habitacion = hotel?.habitaciones?.find((h) => h.id === Number(roomId));

  if (notFound || !hotel || !habitacion) {
    return (
      <Section>
        <div className="flex flex-col items-center gap-4 p-10 text-center">
          <p className="text-neutral">No encontramos esta habitación.</p>
          <Link to={`/hotels/${id}`} className="text-primary font-semibold underline">
            Volver al hotel
          </Link>
        </div>
      </Section>
    );
  }

  const noches = calcularNoches(huesped.checkIn, huesped.checkOut);
  const subtotal = noches * habitacion.precioPorNoche;
  const cargos = Math.round(subtotal * 0.08);
  const total = subtotal + cargos;

  const actualizarHuesped = <K extends keyof DatosHuesped>(campo: K, valor: DatosHuesped[K]) => {
    setHuesped((prev) => ({ ...prev, [campo]: valor }));
  };

  const actualizarPago = <K extends keyof DatosPago>(campo: K, valor: DatosPago[K]) => {
    setPago((prev) => ({ ...prev, [campo]: valor }));
  };

  const setError = (campo: string, mensaje?: string) => {
    setErrores((prev) => ({ ...prev, [campo]: mensaje }));
  };

  const validarCampoEmail = () => {
    setError(
      'email',
      huesped.email && !validarEmail(huesped.email)
        ? 'Ingresá un email válido (ej: nombre@correo.com)'
        : undefined,
    );
  };

  const validarCampoTelefono = () => {
    setError(
      'telefono',
      huesped.telefono && !validarTelefono(huesped.telefono)
        ? 'Ingresá un teléfono válido (mínimo 8 dígitos)'
        : undefined,
    );
  };

  const validarCampoTarjeta = () => {
    setError(
      'numeroTarjeta',
      pago.numeroTarjeta && !validarNumeroTarjeta(pago.numeroTarjeta)
        ? 'Ingresá un número de tarjeta válido (13 a 19 dígitos)'
        : undefined,
    );
  };

  const validarCampoVencimiento = () => {
    setError(
      'vencimiento',
      pago.vencimiento && !validarVencimiento(pago.vencimiento)
        ? 'Usá el formato MM/AAAA (ej: 10/2030)'
        : undefined,
    );
  };

  const validarCampoCVV = () => {
    setError(
      'cvv',
      pago.cvv && !validarCVV(pago.cvv) ? 'El CVV debe tener 3 o 4 dígitos' : undefined,
    );
  };

  const hayErroresActivos = Object.values(errores).some(Boolean);

  const camposFaltantes: string[] = [];
  if (huesped.nombre.trim() === '') camposFaltantes.push('Nombre');
  if (huesped.apellido.trim() === '') camposFaltantes.push('Apellido');
  if (huesped.email.trim() === '' || !validarEmail(huesped.email))
    camposFaltantes.push('Email válido');
  if (huesped.telefono && !validarTelefono(huesped.telefono))
    camposFaltantes.push('Teléfono válido');
  if (huesped.checkIn === '') camposFaltantes.push('Check-in');
  if (huesped.checkOut === '') camposFaltantes.push('Check-out');
  if (huesped.checkIn && huesped.checkOut && noches <= 0)
    camposFaltantes.push('Check-out posterior al Check-in');
  if (pago.nombreTarjeta.trim() === '') camposFaltantes.push('Nombre en la tarjeta');
  if (!validarNumeroTarjeta(pago.numeroTarjeta)) camposFaltantes.push('Número de tarjeta válido');
  if (!validarVencimiento(pago.vencimiento)) camposFaltantes.push('Vencimiento válido (MM/AAAA)');
  if (!validarCVV(pago.cvv)) camposFaltantes.push('CVV válido');

  const formularioValido = camposFaltantes.length === 0 && !hayErroresActivos;

  const confirmarReserva = () => {
    // Fuerza a mostrar los errores de los campos que todavía no se "tocaron"
    // (blur), así el mensaje de abajo coincide con lo que se ve en pantalla.
    validarCampoEmail();
    validarCampoTelefono();
    validarCampoTarjeta();
    validarCampoVencimiento();
    validarCampoCVV();

    if (!formularioValido) {
      setMensajeError(`Falta completar: ${camposFaltantes.join(', ')}.`);
      return;
    }

    setMensajeError(null);
    // Sin backend todavía: solo simula la confirmación en la UI.
    // Acá va a ir la llamada real (axios/react-query) cuando se conecte la API.
    setReservaConfirmada(true);
  };

  if (reservaConfirmada) {
    return (
      <Section>
        <div className="mx-auto flex w-full max-w-150 flex-col items-center gap-4 p-10 text-center">
          <span className="material-symbols-outlined text-primary text-[64px]!">
            check_circle
          </span>
          <h1 className="text-secondary text-2xl font-bold">¡Reserva confirmada!</h1>
          <p className="text-neutral">
            Tu {habitacion.nombre.toLowerCase()} en {hotel.nombre} está lista. Te enviamos los
            detalles a {huesped.email}.
          </p>
          <div className="w-full rounded-2xl border border-black/10 p-5 text-left">
            <p className="text-neutral text-[13px]">Total de la reserva</p>
            <p className="text-secondary text-2xl font-bold">{formatCurrency(total)}</p>
          </div>
          <Button
            variant="primary"
            className="bg-primary w-auto px-8 text-white"
            onClick={() => navigate('/hotels')}
          >
            Seguir explorando hoteles
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <div className="flex w-full flex-col gap-6 p-6">
        <Link
          to={`/hotels/${hotel.id}`}
          className="text-neutral hover:text-primary flex w-max items-center gap-1 text-[14px]"
        >
          <span className="material-symbols-outlined text-[18px]!">arrow_back</span>
          Volver al hotel
        </Link>

        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Columna principal — formulario */}
          <div className="flex flex-col gap-8">
            {/* 1. Datos del huésped principal */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full font-bold">
                  1
                </span>
                <h2 className="text-secondary text-xl font-bold">Datos del Huésped Principal</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  contentLabel="Nombre"
                  placeholder="Melina Celeste"
                  value={huesped.nombre}
                  onChange={(e) => actualizarHuesped('nombre', e.target.value)}
                />
                <Input
                  contentLabel="Apellido"
                  placeholder="Cora"
                  value={huesped.apellido}
                  onChange={(e) => actualizarHuesped('apellido', e.target.value)}
                />

                <div className="flex flex-col gap-1">
                  <Input
                    contentLabel="Email"
                    type="email"
                    placeholder="melinaccora97@gmail.com"
                    value={huesped.email}
                    onChange={(e) => actualizarHuesped('email', e.target.value)}
                    onBlur={validarCampoEmail}
                    className={errores.email ? 'border-alert' : ''}
                  />
                  {errores.email && <p className="text-alert text-[13px]">{errores.email}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <Input
                    contentLabel="Teléfono"
                    type="tel"
                    placeholder="11 5331 1347"
                    value={huesped.telefono}
                    onChange={(e) => actualizarHuesped('telefono', e.target.value)}
                    onBlur={validarCampoTelefono}
                    className={errores.telefono ? 'border-alert' : ''}
                  />
                  {errores.telefono && (
                    <p className="text-alert text-[13px]">{errores.telefono}</p>
                  )}
                </div>

                <Input
                  contentLabel="Check-in"
                  type="date"
                  value={huesped.checkIn}
                  onChange={(e) => actualizarHuesped('checkIn', e.target.value)}
                />
                <Input
                  contentLabel="Check-out"
                  type="date"
                  value={huesped.checkOut}
                  onChange={(e) => actualizarHuesped('checkOut', e.target.value)}
                />
                <Input
                  contentLabel="Huéspedes"
                  type="number"
                  min={1}
                  max={habitacion.capacidad}
                  value={huesped.huespedes}
                  onChange={(e) => actualizarHuesped('huespedes', Number(e.target.value))}
                  containerClassname="sm:col-span-2"
                />

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="font-semibold text-[#1A2B4C]">
                    Solicitudes Especiales (Opcional)
                  </label>
                  <textarea
                    placeholder="Habitación para no fumadores, check-in temprano si es posible."
                    value={huesped.solicitudes}
                    onChange={(e) => actualizarHuesped('solicitudes', e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-black/20 p-2"
                  />
                </div>
              </div>
            </div>

            {/* 2. Método de pago */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full font-bold">
                  2
                </span>
                <h2 className="text-secondary text-xl font-bold">Método de Pago</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  contentLabel="Nombre en la Tarjeta"
                  placeholder="MELINA CELESTE CORA"
                  value={pago.nombreTarjeta}
                  onChange={(e) => actualizarPago('nombreTarjeta', e.target.value)}
                  containerClassname="sm:col-span-2"
                />

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <Input
                    contentLabel="Número de Tarjeta"
                    placeholder="1234 5678 9012 3456"
                    value={pago.numeroTarjeta}
                    onChange={(e) => actualizarPago('numeroTarjeta', e.target.value)}
                    onBlur={validarCampoTarjeta}
                    className={errores.numeroTarjeta ? 'border-alert' : ''}
                  />
                  {errores.numeroTarjeta && (
                    <p className="text-alert text-[13px]">{errores.numeroTarjeta}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <Input
                    contentLabel="Fecha de Vencimiento"
                    placeholder="10/2030"
                    value={pago.vencimiento}
                    onChange={(e) => actualizarPago('vencimiento', e.target.value)}
                    onBlur={validarCampoVencimiento}
                    className={errores.vencimiento ? 'border-alert' : ''}
                  />
                  {errores.vencimiento && (
                    <p className="text-alert text-[13px]">{errores.vencimiento}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <Input
                    contentLabel="CVV / Código de Seguridad"
                    placeholder="123"
                    maxLength={4}
                    value={pago.cvv}
                    onChange={(e) => actualizarPago('cvv', e.target.value)}
                    onBlur={validarCampoCVV}
                    className={errores.cvv ? 'border-alert' : ''}
                  />
                  {errores.cvv && <p className="text-alert text-[13px]">{errores.cvv}</p>}
                </div>
              </div>
            </div>

            {/* Cross-sell: conecta con la sección de vuelos del equipo */}
            <div className="border-primary bg-primary/5 flex flex-col gap-3 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white">
                  <span className="material-symbols-outlined text-[20px]!">flight</span>
                </span>
                <div>
                  <p className="text-secondary font-semibold">
                    ¿Querés agregar un vuelo a {hotel.ciudad}?
                  </p>
                  <p className="text-neutral text-[14px]">
                    Obtené un <span className="text-primary font-semibold">ahorro inmediato</span>{' '}
                    convirtiendo tu viaje en paquete.
                  </p>
                </div>
              </div>
              <Link
                to="/"
                className="bg-secondary w-full rounded-[10px] px-6 py-2 text-center font-bold text-white sm:w-auto"
              >
                Añadir Vuelo
              </Link>
            </div>
          </div>

          {/* Sidebar — resumen de la reserva */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
            <div className="flex flex-col gap-4 rounded-2xl border border-black/10 p-5">
              <h2 className="text-secondary font-bold">Resumen de la Reserva</h2>

              <div className="flex items-center gap-3">
                <img
                  src={hotel.imageUrl}
                  alt={hotel.nombre}
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <div>
                  <p className="text-secondary font-semibold">{hotel.nombre}</p>
                  <p className="text-neutral text-[13px]">
                    {hotel.ciudad}, {hotel.pais}
                  </p>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`material-symbols-outlined text-[14px]! ${
                          i < hotel.estrellas ? 'text-primary' : 'text-black/20'
                        }`}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <hr className="text-black/10" />

              <div className="flex flex-col gap-2 text-[14px]">
                <div className="flex justify-between">
                  <span className="text-neutral">Habitación</span>
                  <span className="text-secondary font-semibold">{habitacion.nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral">Noches</span>
                  <span className="text-secondary font-semibold">
                    {noches > 0 ? `${noches} ${noches === 1 ? 'Noche' : 'Noches'}` : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral">Huéspedes</span>
                  <span className="text-secondary font-semibold">
                    {huesped.huespedes} {huesped.huespedes === 1 ? 'Adulto' : 'Adultos'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral">Check-in</span>
                  <span className="text-secondary font-semibold">
                    {formatFechaCorta(huesped.checkIn)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral">Check-out</span>
                  <span className="text-secondary font-semibold">
                    {formatFechaCorta(huesped.checkOut)}
                  </span>
                </div>
              </div>

              <hr className="text-black/10" />

              <div className="flex flex-col gap-2 text-[14px]">
                <div className="flex justify-between">
                  <span className="text-neutral">
                    Precio ({formatCurrency(habitacion.precioPorNoche)} x noche)
                  </span>
                  <span className="text-secondary">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral">Cargos e Impuestos</span>
                  <span className="text-secondary">{formatCurrency(cargos)}</span>
                </div>
              </div>

              <hr className="text-black/10" />

              <div className="flex items-center justify-between">
                <span className="text-secondary text-lg font-bold">Total Final</span>
                <span className="text-primary text-2xl font-bold">{formatCurrency(total)}</span>
              </div>

              {mensajeError && (
                <p className="text-alert rounded-lg bg-red-50 p-3 text-[13px]">{mensajeError}</p>
              )}

              <Button
                variant="primary"
                className={formularioValido ? 'bg-primary text-white' : 'bg-primary/50 text-white'}
                onClick={confirmarReserva}
              >
                Confirmar Reserva
              </Button>
            </div>

            <div className="flex flex-col gap-2 rounded-2xl border border-black/10 p-5">
              <p className="text-secondary flex items-center gap-2 font-semibold">
                <span className="material-symbols-outlined text-primary text-[20px]!">
                  info
                </span>
                Políticas de Cancelación
              </p>
              <p className="text-neutral text-[14px]">
                <span className="font-semibold text-green-600">Cancelación gratuita</span> hasta
                48hs antes del check-in. Posterior a esa fecha, se penalizará con el costo de la
                primera noche.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
