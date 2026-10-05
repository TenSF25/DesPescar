import { describe, expect, it } from 'vitest';
import type { Carrito } from '@/features/cart/cart.types';
import type { Grupo, GrupoResumen, ParteGrupo } from './grupo.types';
import {
  aCentavos,
  apodoValido,
  cambiosGrupo,
  deCentavos,
  debeConsultarGrupo,
  enlaceInvitacion,
  estadoGrupoTexto,
  estadoParteTexto,
  formatMonto,
  formatPlazo,
  leerErrorGrupo,
  maxPartes,
  nombreParte,
  parsearMonto,
  progresoGrupo,
  puedeDividir,
  repartoIgual,
  resumenGrupoTexto,
  tokenValido,
  urgenciaPlazo,
  validarMontos,
} from './grupo';

const parte = (cambios: Partial<ParteGrupo> = {}): ParteGrupo => ({
  numero: 2,
  monto: 353333.33,
  estado: 'TOMADA',
  apodo: 'Juli',
  esOrganizador: false,
  esMia: false,
  ...cambios,
});

const grupo = (cambios: Partial<Grupo> = {}): Grupo => ({
  reservaId: 12,
  estado: 'ABIERTO',
  venceEn: '2026-10-06T15:00:00',
  segundosRestantes: 86100,
  montoTotal: 1060000,
  moneda: 'ARS',
  montoPagado: 353333.34,
  cantidadPartes: 3,
  partesPagadas: 1,
  soyOrganizador: true,
  miParte: 1,
  enlaceToken: 'a'.repeat(43),
  puedeEditarMontos: false,
  motivoCierre: null,
  partes: [
    parte({
      numero: 1,
      monto: 353333.34,
      estado: 'PAGADA',
      apodo: null,
      esOrganizador: true,
      esMia: true,
    }),
    parte({ numero: 2 }),
    parte({ numero: 3, estado: 'LIBRE', apodo: null }),
  ],
  viaje: { vuelo: null, estadias: [] },
  ...cambios,
});

const carrito = (cambios: Partial<Carrito> = {}): Carrito => ({
  idCarrito: 12,
  creadorId: 7,
  estadoGeneral: 'PENDIENTE_PAGO',
  segundosRestantes: 600,
  montoTotal: 1060000,
  moneda: 'ARS',
  cantidadItems: 2,
  datosCompletos: true,
  vuelo: null,
  estadias: [],
  asientos: [],
  ...cambios,
});

describe('centavos', () => {
  it('convierte ida y vuelta sin flotantes', () => {
    expect(aCentavos(353333.33)).toBe(35333333);
    expect(aCentavos(0.1 + 0.2)).toBe(30);
    expect(deCentavos(35333333)).toBe(353333.33);
  });

  it('muestra decimales solo si los hay', () => {
    // Intl usa un espacio duro entre el signo y el número: se normaliza para comparar.
    const sinEspacios = (s: string) => s.replace(/\s/g, ' ');
    expect(sinEspacios(formatMonto(1060000))).toBe('$ 1.060.000');
    expect(sinEspacios(formatMonto(353333.33))).toBe('$ 353.333,33');
    expect(sinEspacios(formatMonto(353333.3))).toBe('$ 353.333,30');
  });

  it('parsea lo que escribe una persona en Argentina', () => {
    expect(parsearMonto('353333,33')).toBe(35333333);
    expect(parsearMonto('353.333,33')).toBe(35333333);
    expect(parsearMonto('353333.33')).toBe(35333333);
    expect(parsearMonto('$ 1.060.000')).toBe(106000000);
    expect(parsearMonto('1.060.000,5')).toBe(106000050);
    expect(parsearMonto('')).toBeNull();
    expect(parsearMonto('abc')).toBeNull();
    expect(parsearMonto('-5')).toBeNull();
    expect(parsearMonto('1,234')).toBeNull();
  });
});

describe('reparto', () => {
  it('reparte en partes iguales y le deja el resto a la parte 1, como el back', () => {
    expect(repartoIgual(106000000, 3)).toEqual([35333334, 35333333, 35333333]);
    expect(repartoIgual(100000, 2)).toEqual([50000, 50000]);
    expect(repartoIgual(100001, 10)).toEqual([
      10001, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000,
    ]);
  });

  it('valida que sumen el total y que ninguna baje de $100', () => {
    expect(validarMontos([40000000, 33000000, 33000000], 106000000)).toEqual({
      ok: true,
      diferencia: 0,
      errores: [null, null, null],
    });
    const corta = validarMontos([40000000, 33000000, 32000000], 106000000);
    expect(corta.ok).toBe(false);
    expect(corta.diferencia).toBe(1000000);
    const chica = validarMontos([105990001, 9999], 106000000);
    expect(chica.ok).toBe(false);
    expect(chica.errores[1]).toMatch(/100/);
    const vacia = validarMontos([null, 106000000], 106000000);
    expect(vacia.ok).toBe(false);
    expect(vacia.errores[0]).toMatch(/monto/i);
  });

  it('cuántas partes admite el total', () => {
    expect(maxPartes(106000000)).toBe(10);
    expect(maxPartes(35000)).toBe(3);
    expect(maxPartes(19999)).toBe(1);
  });

  it('solo se divide un carrito listo para pagar, sin vencer y que alcance para dos partes', () => {
    expect(puedeDividir(carrito())).toBe(true);
    expect(puedeDividir(carrito({ estadoGeneral: 'INICIADA' }))).toBe(false);
    expect(puedeDividir(carrito({ datosCompletos: false }))).toBe(false);
    expect(puedeDividir(carrito({ segundosRestantes: 0 }))).toBe(false);
    expect(puedeDividir(carrito({ montoTotal: 150 }))).toBe(false);
    expect(puedeDividir(carrito({ estadoGeneral: 'ESPERANDO_PAGADORES' }))).toBe(false);
  });
});

describe('textos', () => {
  it('nombra cada parte sin datos personales', () => {
    expect(nombreParte(parte({ esMia: true }))).toBe('Vos');
    expect(nombreParte(parte({ esOrganizador: true, apodo: null }))).toBe('Organizador/a');
    expect(nombreParte(parte({ apodo: 'Juli' }))).toBe('Juli');
    expect(nombreParte(parte({ apodo: null }))).toBe('Invitado/a 2');
    expect(nombreParte(parte({ estado: 'LIBRE', apodo: null }))).toBe('Parte 2');
  });

  it('describe el estado de una parte', () => {
    expect(estadoParteTexto(parte({ estado: 'LIBRE' }))).toEqual({
      texto: 'Libre',
      tono: 'neutro',
    });
    expect(estadoParteTexto(parte({ estado: 'TOMADA' }))).toEqual({
      texto: 'Falta pagar',
      tono: 'aviso',
    });
    expect(estadoParteTexto(parte({ estado: 'PAGADA' }))).toEqual({
      texto: 'Pagada',
      tono: 'exito',
    });
  });

  it('describe el estado del grupo según el motivo de cierre', () => {
    expect(estadoGrupoTexto(grupo()).titulo).toBe('Esperando que paguen todos');
    expect(estadoGrupoTexto(grupo({ estado: 'COMPLETO' })).titulo).toBe('Confirmando la reserva');
    expect(estadoGrupoTexto(grupo({ estado: 'CONFIRMADO' })).titulo).toBe('¡Reserva confirmada!');
    const vencido = estadoGrupoTexto(
      grupo({ estado: 'VENCIDO', motivoCierre: 'PAGO_EN_GRUPO_VENCIDO' }),
    );
    expect(vencido.titulo).toBe('Se venció el plazo');
    expect(vencido.detalle).toMatch(/devolvemos/);
    const sinLugar = estadoGrupoTexto(
      grupo({ estado: 'CANCELADO', motivoCierre: 'SIN_DISPONIBILIDAD' }),
    );
    expect(sinLugar.titulo).toBe('No pudimos confirmar la reserva');
    expect(
      estadoGrupoTexto(grupo({ estado: 'CANCELADO', motivoCierre: 'GRUPO_CANCELADO' })).titulo,
    ).toBe('El grupo se canceló');
  });

  it('explica el cierre cuando la reserva del grupo no se pudo confirmar', () => {
    const fallida = estadoGrupoTexto(
      grupo({ estado: 'CANCELADO', motivoCierre: 'CONFIRMACION_FALLIDA' }),
    );
    expect(fallida.titulo).toBe('No pudimos confirmar la reserva');
    expect(fallida.detalle).toBe(
      'No pudimos confirmar la reserva del grupo. Cancelamos todo y les devolvimos el dinero a quienes ya habían pagado.',
    );
    expect(fallida.tono).toBe('error');
  });

  it('formatea el plazo en horas y minutos', () => {
    expect(formatPlazo(86100)).toBe('23 h 55 min');
    expect(formatPlazo(3600)).toBe('1 h');
    expect(formatPlazo(900)).toBe('15 min');
    expect(formatPlazo(59)).toBe('menos de un minuto');
    expect(formatPlazo(0)).toBe('vencido');
    expect(urgenciaPlazo(7200)).toBe('normal');
    expect(urgenciaPlazo(3599)).toBe('aviso');
    expect(urgenciaPlazo(0)).toBe('vencido');
  });

  it('resume el progreso', () => {
    expect(progresoGrupo(grupo())).toBe('1 de 3 partes pagadas');
    expect(progresoGrupo(grupo({ partesPagadas: 3, cantidadPartes: 3 }))).toBe(
      '3 de 3 partes pagadas',
    );
  });

  it('anuncia los cambios entre dos lecturas (D-b19)', () => {
    const antes = grupo();
    expect(cambiosGrupo(null, antes)).toEqual([]);
    expect(cambiosGrupo(antes, antes)).toEqual([]);
    const seSumo = grupo({
      partes: [antes.partes[0], antes.partes[1], parte({ numero: 3, apodo: 'Fer' })],
    });
    expect(cambiosGrupo(antes, seSumo)).toEqual(['Fer se sumó al grupo.']);
    const pago = grupo({
      partesPagadas: 2,
      partes: [antes.partes[0], parte({ numero: 2, estado: 'PAGADA' }), antes.partes[2]],
    });
    expect(cambiosGrupo(antes, pago)).toEqual(['Juli pagó su parte.']);
    expect(cambiosGrupo(antes, grupo({ estado: 'CONFIRMADO' }))).toEqual(['¡Reserva confirmada!']);
    expect(
      cambiosGrupo(antes, grupo({ estado: 'VENCIDO', motivoCierre: 'PAGO_EN_GRUPO_VENCIDO' })),
    ).toEqual(['Se venció el plazo del pago en grupo.']);
    const liberada = grupo({
      partes: [
        antes.partes[0],
        parte({ numero: 2, estado: 'LIBRE', apodo: null }),
        antes.partes[2],
      ],
    });
    expect(cambiosGrupo(antes, liberada)).toEqual(['La parte 2 quedó libre.']);
  });
});

describe('enlace y consulta', () => {
  it('arma el enlace y valida el token', () => {
    expect(enlaceInvitacion('a'.repeat(43), 'https://despescar.com')).toBe(
      `https://despescar.com/grupo/${'a'.repeat(43)}`,
    );
    expect(tokenValido('a'.repeat(43))).toBe(true);
    expect(tokenValido('a'.repeat(42))).toBe(false);
    expect(tokenValido('a'.repeat(42) + '/')).toBe(false);
    expect(tokenValido('')).toBe(false);
  });

  it('consulta mientras el grupo está abierto o completo y la pestaña visible', () => {
    expect(debeConsultarGrupo('ABIERTO', true)).toBe(true);
    expect(debeConsultarGrupo('COMPLETO', true)).toBe(true);
    expect(debeConsultarGrupo('ABIERTO', false)).toBe(false);
    expect(debeConsultarGrupo('CONFIRMADO', true)).toBe(false);
    expect(debeConsultarGrupo('VENCIDO', true)).toBe(false);
  });
});

describe('errores', () => {
  const axiosError = (status: number, data: unknown) => ({
    isAxiosError: true,
    response: { status, data },
    toJSON: () => ({}),
    name: 'AxiosError',
    message: 'x',
  });

  it('traduce los códigos del grupo que llegan sin mensaje y respeta los que lo traen', () => {
    expect(leerErrorGrupo(axiosError(409, { codigo: 'GRUPO_COMPLETO' }), 'x').mensaje).toMatch(
      /ya está completo/,
    );
    expect(leerErrorGrupo(axiosError(410, { codigo: 'ENLACE_VENCIDO' }), 'x').mensaje).toMatch(
      /ya no está activo/,
    );
    expect(leerErrorGrupo(axiosError(404, { codigo: 'GRUPO_NO_ENCONTRADO' }), 'x').mensaje).toMatch(
      /no es válido/,
    );
    expect(
      leerErrorGrupo(axiosError(409, { codigo: 'PAGO_EN_GRUPO_EN_CURSO' }), 'x').mensaje,
    ).toMatch(/pago en grupo/);
    expect(
      leerErrorGrupo(axiosError(409, { codigo: 'GRUPO_CON_PAGOS', mensaje: 'Del servidor.' }), 'x')
        .mensaje,
    ).toBe('Del servidor.');
    expect(
      leerErrorGrupo(
        axiosError(403, {
          codigo: 'ACCESO_DENEGADO',
          mensaje: 'No tenés permisos para esta acción.',
        }),
        'x',
      ),
    ).toEqual({
      status: 403,
      codigo: 'ACCESO_DENEGADO',
      mensaje: 'No tenés permisos para esta acción.',
    });
    expect(leerErrorGrupo(new Error('x'), 'por defecto').mensaje).toBe('por defecto');
  });
});

describe('apodoValido', () => {
  it("acepta vacío, letras con acentos, números, espacios y . ' -", () => {
    expect(apodoValido('')).toBe(true);
    expect(apodoValido('Juli')).toBe(true);
    expect(apodoValido("María José O'Brien-2 Jr.")).toBe(true);
    expect(apodoValido('ñandú 10')).toBe(true);
  });
  it('rechaza símbolos, emojis y más de 30 caracteres', () => {
    expect(apodoValido('juli@mail.com')).toBe(false);
    expect(apodoValido('<b>Juli</b>')).toBe(false);
    expect(apodoValido('Juli 🎉')).toBe(false);
    expect(apodoValido('a'.repeat(31))).toBe(false);
    expect(apodoValido('a'.repeat(30))).toBe(true);
  });
  it('mide el apodo sin los espacios de las puntas', () => {
    expect(apodoValido(`  ${'a'.repeat(30)}  `)).toBe(true);
  });
});

describe('resumenGrupoTexto', () => {
  const resumen = (cambios: Partial<GrupoResumen> = {}): GrupoResumen => ({
    reservaId: 12,
    enlaceToken: 'a'.repeat(43),
    estado: 'ABIERTO',
    venceEn: '2026-10-06T15:00:00',
    segundosRestantes: 23 * 3600 + 40 * 60,
    soyOrganizador: false,
    miParte: 2,
    monto: 353333.33,
    estadoParte: 'TOMADA',
    destino: 'Córdoba',
    ...cambios,
  });
  const limpio = (s: string) => s.replace(/\s/g, ' ');

  it('parte sin pagar en un grupo abierto: monto, plazo y acceso a pagar', () => {
    const r = resumenGrupoTexto(resumen());
    expect(r.titulo).toBe('Viaje a Córdoba');
    expect(limpio(r.detalle)).toBe('Tu parte: $ 353.333,33 · quedan 23 h 40 min');
    expect(r.estado).toEqual({ texto: 'Falta pagar', tono: 'aviso' });
    expect(r.accion).toBe('Pagar mi parte');
  });
  it('parte pagada: se espera al resto', () => {
    const r = resumenGrupoTexto(resumen({ estadoParte: 'PAGADA' }));
    expect(r.estado.texto).toBe('Pagada');
    expect(limpio(r.detalle)).toBe('Tu parte: $ 353.333,33 · quedan 23 h 40 min');
    expect(r.accion).toBe('Ver el grupo');
  });
  it('grupo completo: se está confirmando', () => {
    const r = resumenGrupoTexto(resumen({ estado: 'COMPLETO', estadoParte: 'PAGADA' }));
    expect(limpio(r.detalle)).toBe('Tu parte: $ 353.333,33 · confirmando la reserva');
    expect(r.accion).toBe('Ver el grupo');
  });
  it('sin destino usa el número de reserva, y dice si lo organizás', () => {
    expect(resumenGrupoTexto(resumen({ destino: null })).titulo).toBe('Reserva #12');
    expect(resumenGrupoTexto(resumen({ soyOrganizador: true })).titulo).toBe(
      'Viaje a Córdoba · lo organizás vos',
    );
  });
  it('con el plazo vencido no ofrece pagar', () => {
    const r = resumenGrupoTexto(resumen({ segundosRestantes: 0 }));
    expect(r.accion).toBe('Ver el grupo');
    expect(limpio(r.detalle)).toBe('Tu parte: $ 353.333,33 · plazo vencido');
  });
});
