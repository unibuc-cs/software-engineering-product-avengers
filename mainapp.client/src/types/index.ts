export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    city: string;
    airport: string;
    time: string;
  };
  arrival: {
    city: string;
    airport: string;
    time: string;
  };
  price: {
    amount: number;
    currency: string;
  };
  duration: string;
  stops: number;
}

export interface Accommodation {
  id: string;
  name: string;
  type: 'hotel' | 'apartment' | 'resort';
  address: string;
  city: string;
  rating: number;
  price: {
    amount: number;
    currency: string;
    per: 'night' | 'week';
  };
  amenities: string[];
  images: string[];
  description: string;
}

export interface Activity {
  id: string;
  name: string;
  type: string;
  location: {
    address: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  duration: string;
  price: {
    amount: number;
    currency: string;
  };
  description: string;
  images: string[];
  rating: number;
  reviews: number;
}

export interface User {

  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: {
    currency: string;
    language: string;
    notifications: boolean;
  };
} 