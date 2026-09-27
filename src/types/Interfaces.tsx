export interface Airport {
  id: number;
  name: string;
  city: string;
  country: string;
  code: string;
}

export interface User {
  id: number;
  firsName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AuthState {
  tokens: TokenData | null;
  user: User | null;
  login: (tokensData: TokenData, userData: User) => void;
  logout: () => void;
}

export interface SearchProps {
  origen?: Airport | null;
  destino?: Airport | null;
  fecha?: string;
  pasajeros?: number;
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

export interface RutaBuscada {
  origin?: string;
  destination?: string;
  departureDate?: string;
  returnDate?: string;
  passengers?: number;
}
