import { mockDelay } from '../../../../services/mockDelay';
// import { apiRequest } from '../../../../services/apiClient';
// import { API_CONFIG } from '../../../../services/apiConfig';
import type { AdminFlight, FlightStats, NewFlightInput } from '../admin-flights.types';

// Array mutable "en memoria" para simular un backend real durante la sesión:
// crear/eliminar acá sí persisten mientras no se recargue la página.
let mockFlights: AdminFlight[] = [
  { id: 'f1', numero: 'DSC2456', origen: 'MAD', destino: 'MEX', fecha: '15 Oct 2024', hora: '10:30 AM', estado: 'En curso', precioProm: 218 },
  { id: 'f2', numero: 'DSC7891', origen: 'MIA', destino: 'BOG', fecha: '16 Oct 2024', hora: '08:45 AM', estado: 'Programado', precioProm: 195 },
  { id: 'f3', numero: 'DSC1123', origen: 'JFK', destino: 'SCL', fecha: '16 Oct 2024', hora: '11:20 AM', estado: 'Programado', precioProm: 265 },
  { id: 'f4', numero: 'DSC3344', origen: 'LIM', destino: 'MAD', fecha: '14 Oct 2024', hora: '09:10 AM', estado: 'Completado', precioProm: 205 },
  { id: 'f5', numero: 'DSC6622', origen: 'EZE', destino: 'MIA', fecha: '13 Oct 2024', hora: '07:50 PM', estado: 'Cancelado', precioProm: 180 },
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
export const createFlight = async (input: NewFlightInput): Promise<AdminFlight> => {
  await mockDelay();
  const newFlight: AdminFlight = {
    id: `f${Date.now()}`,
    estado: 'Programado',
    ...input,
  };
  mockFlights = [newFlight, ...mockFlights];
  return newFlight;
};

// TODO(backend): apiRequest<void>(API_CONFIG.flightsServiceUrl, `/vuelos/${id}`, { method: 'DELETE' })
export const deleteFlight = async (id: string): Promise<void> => {
  await mockDelay();
  mockFlights = mockFlights.filter((flight) => flight.id !== id);
};
