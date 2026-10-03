import { addDays, format } from 'date-fns';
import { mockDelay } from '@/utils/mockDelay';

/** Fecha (YYYY-MM-DD) a `offset` días de hoy, para que los datos de prueba siempre estén vigentes. */
const dayFromToday = (offset: number) => format(addDays(new Date(), offset), 'yyyy-MM-dd');
import type { AdminFlight, FlightStats, FlightInput } from '../admin-flights.types';

// Array mutable "en memoria" para simular un backend real durante la sesión:
// crear/eliminar acá sí persisten mientras no se recargue la página.
let mockFlights: AdminFlight[] = [
  {
    id: 'f1',
    numero: 'DSC2456',
    origen: 'MAD',
    destino: 'MEX',
    fecha: dayFromToday(0),
    hora: '10:30',
    estado: 'En curso',
    precioProm: 218,
  },
  {
    id: 'f2',
    numero: 'DSC7891',
    origen: 'MIA',
    destino: 'BOG',
    fecha: dayFromToday(2),
    hora: '08:45',
    estado: 'Programado',
    precioProm: 195,
  },
  {
    id: 'f3',
    numero: 'DSC1123',
    origen: 'JFK',
    destino: 'SCL',
    fecha: dayFromToday(3),
    hora: '11:20',
    estado: 'Programado',
    precioProm: 265,
  },
  {
    id: 'f4',
    numero: 'DSC3344',
    origen: 'LIM',
    destino: 'MAD',
    fecha: dayFromToday(-1),
    hora: '09:10',
    estado: 'Completado',
    precioProm: 205,
  },
  {
    id: 'f5',
    numero: 'DSC6622',
    origen: 'EZE',
    destino: 'MIA',
    fecha: dayFromToday(-2),
    hora: '19:50',
    estado: 'Cancelado',
    precioProm: 180,
  },
];

const MOCK_STATS: FlightStats = {
  vuelosTotales: 85,
  vuelosEnCurso: 12,
  completados: 62,
  completadosDeltaPct: 8.3,
  programados: 8,
  cancelados: 15,
  canceladosDeltaPct: -3.2,
};

// TODO(backend): apiRequest<AdminFlight[]>(API_CONFIG.flightsServiceUrl, '/vuelos', { params: { search, estado, origen, fecha, page } })
export const getFlights = async (): Promise<AdminFlight[]> => {
  await mockDelay();
  return mockFlights;
};

// TODO(backend): apiRequest<FlightStats>(API_CONFIG.flightsServiceUrl, '/vuelos/stats')
export const getFlightStats = async (): Promise<FlightStats> => {
  await mockDelay();
  return MOCK_STATS;
};

// TODO(backend): apiRequest<AdminFlight>(API_CONFIG.flightsServiceUrl, '/vuelos', { method: 'POST', body: input })
export const createFlight = async (input: FlightInput): Promise<AdminFlight> => {
  await mockDelay();
  const newFlight: AdminFlight = {
    id: `f${Date.now()}`,
    ...input,
    estado: input.estado ?? 'Programado',
  };
  mockFlights = [newFlight, ...mockFlights];
  return newFlight;
};

// TODO(backend): apiRequest<void>(API_CONFIG.flightsServiceUrl, `/vuelos/${id}`, { method: 'DELETE' })
export const deleteFlight = async (id: string): Promise<void> => {
  await mockDelay();
  mockFlights = mockFlights.filter((flight) => flight.id !== id);
};

// TODO(backend): apiRequest<AdminFlight>(API_CONFIG.flightsServiceUrl, `/vuelos/${id}`, { method: 'PUT', body: input })
export const updateFlight = async (id: string, input: FlightInput): Promise<AdminFlight> => {
  await mockDelay();
  const current = mockFlights.find((flight) => flight.id === id);
  if (!current) throw new Error('Vuelo no encontrado');
  const updated: AdminFlight = { ...current, ...input, estado: input.estado ?? current.estado };
  mockFlights = mockFlights.map((flight) => (flight.id === id ? updated : flight));
  return updated;
};
