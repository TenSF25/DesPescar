export interface FlightService {
  airlineId: number;
  airportOriginId: number;
  airportDestinyId: number;
  takeOffDate: string;
  landingDate: string;
  duration: number;
  status: 'A tiempo' | 'Check-in Abierto' | 'Check-in cerrado';
}

export interface Airline {
  name: string;
  logoUrl: string;
}

export interface FlightUbication {
  iata: string;
  dateTime: string;
}

export interface Itinerary {
  departure: FlightUbication;
  arrival: FlightUbication;
  durationMinutes: number;
  flightType: 'DIRECTO' | 'CON_ESCALA';
}

export interface MetadataSearch {
  totalResults: number;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
}

export interface FechaDisponible {
  fecha: string;
  precioDesde: number;
}

export interface IncludedServices {
  personalItem: boolean;
  carryOn: boolean;
  checkedBaggage: boolean;
  wifi: boolean;
  seatSelection: string;
}

export interface DetailPrice {
  currency: string;
  baseFare: number;
  taxesAndFees: number;
  transparentFinalPrice: number;
}

export interface Fare {
  id: string;
  name: string;
  type: string;
  includedServices: IncludedServices;
  price: DetailPrice;
}

export type FiltroEscala = 'Todos' | 'Directo' | '1 escala' | '2 escalas';

export interface Scale {
  iata: string;
  city: string;
  waitDurationMinutes: number;
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: Airline;
  aircraft: string;
  itinerary: Itinerary;
  scales: Scale[];
  includedServices: IncludedServices;
  price: DetailPrice;
  fares: Fare[];
}

export interface FlightById {
  airline: Airline;
  arrivalTime: string;
  availableSeats: number;
  departureTime: string;
  destinationAirport: {
    city: string;
    code: string;
    country: string;
    id: string;
    name: string;
  };
  fares: Fare[];
  flightNumber: string;
  id: string;
  originAirport: {
    city: string;
    code: string;
    country: string;
    id: string;
    name: string;
  };
  price: number;
  status: string;
}

export interface VuelosResponse {
  metadatos: MetadataSearch;
  departureFlights: Flight[];
  returnFlights: Flight[];
}
