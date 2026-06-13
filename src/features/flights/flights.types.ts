export interface FlightService {
  airlineId: number;
  airportOriginId: number;
  airportDestinyId: number;
  takeOffDate: string;
  landingDate: string;
  duration: number;
  status: 'A tiempo' | 'Check-in Abierto' | 'Check-in cerrado';
}
