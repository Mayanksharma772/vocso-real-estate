export interface Project {
  id: string;
  name: string;
  location: string;
  priceRange: string;
  builderName: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  url?: string;
  image?: string;
  description?: string;
}

export interface ScrapingProgress {
  total: number;
  scraped: number;
  geocoded: number;
  status: 'idle' | 'scraping' | 'geocoding' | 'completed' | 'error';
  error?: string;
}

export interface PositionStackResponse {
  data: Array<{
    latitude: number;
    longitude: number;
    label: string;
    name: string;
    type: string;
    number?: string;
    street?: string;
    postal_code?: string;
    confidence: number;
    region: string;
    country: string;
    country_code: string;
    administrative_area?: string;
    neighbourhood?: string;
    locality?: string;
  }>;
}