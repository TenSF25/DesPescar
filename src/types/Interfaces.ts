export interface Aeropuerto {
  id: number;
  nombre: string;
  ciudad: string;
  pais: string;
  codigo_iata: string;
  coordenadas: {
    latitud: number;
    longitud: number;
  };
  activo: boolean;
  aerolineas_principales: string[];
}

export interface FligthCardsProps {
  country: string;
  city?: string;
  description?: string;
  price?: number;
  priceOffer?: number;
  imageUrl: string;
  scale?: string;
  timeFly?: number;
  variant?: 'full' | 'preview';
}
