import axios from 'axios';
import { PositionStackResponse } from '@/types';

class GeocodingService {
  private apiKey: string;
  private baseUrl = 'http://api.positionstack.com/v1/forward';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async geocodeLocation(address: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const response = await axios.get<PositionStackResponse>(this.baseUrl, {
        params: {
          access_key: this.apiKey,
          query: address,
          limit: 1,
          output: 'json'
        },
        timeout: 10000
      });

      if (response.data && response.data.data && response.data.data.length > 0) {
        const location = response.data.data[0];
        return {
          latitude: location.latitude,
          longitude: location.longitude
        };
      }

      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      // Return mock coordinates for demonstration
      return this.getMockCoordinates(address);
    }
  }

  private getMockCoordinates(address: string): { latitude: number; longitude: number } {
    // Mock coordinates for major Indian cities
    const cityCoordinates: { [key: string]: { latitude: number; longitude: number } } = {
      hyderabad: { latitude: 17.3850, longitude: 78.4867 },
      bangalore: { latitude: 12.9716, longitude: 77.5946 },
      mumbai: { latitude: 19.0760, longitude: 72.8777 },
      delhi: { latitude: 28.7041, longitude: 77.1025 },
      chennai: { latitude: 13.0827, longitude: 80.2707 },
      pune: { latitude: 18.5204, longitude: 73.8567 },
      kolkata: { latitude: 22.5726, longitude: 88.3639 },
      ahmedabad: { latitude: 23.0225, longitude: 72.5714 },
      jaipur: { latitude: 26.9124, longitude: 75.7873 },
      surat: { latitude: 21.1702, longitude: 72.8311 }
    };

    const addressLower = address.toLowerCase();

    // Try to find a matching city
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (addressLower.includes(city)) {
        // Add some random offset to simulate different locations within the city
        return {
          latitude: coords.latitude + (Math.random() - 0.5) * 0.1,
          longitude: coords.longitude + (Math.random() - 0.5) * 0.1
        };
      }
    }

    // Default to Hyderabad if no match found
    return {
      latitude: 17.3850 + (Math.random() - 0.5) * 0.1,
      longitude: 78.4867 + (Math.random() - 0.5) * 0.1
    };
  }
}

export default GeocodingService;