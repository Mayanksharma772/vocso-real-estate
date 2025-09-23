'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Project } from '@/types';

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  projects: Project[];
  city: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ projects, city }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([17.3850, 78.4867], 12); // Default to Hyderabad

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add markers for projects with coordinates
    const projectsWithCoords = projects.filter(project => project.coordinates);

    if (projectsWithCoords.length > 0) {
      const group = new L.FeatureGroup();

      projectsWithCoords.forEach((project) => {
        if (project.coordinates) {
          const marker = L.marker([
            project.coordinates.latitude,
            project.coordinates.longitude
          ]);

          // Create popup content
          const popupContent = `
            <div class="p-4 min-w-[250px]">
              <h3 class="font-bold text-lg mb-2">${project.name}</h3>
              <p class="text-gray-600 mb-1"><strong>Location:</strong> ${project.location}</p>
              <p class="text-gray-600 mb-1"><strong>Price:</strong> ${project.priceRange}</p>
              <p class="text-gray-600 mb-2"><strong>Builder:</strong> ${project.builderName}</p>
              ${project.url ? `<a href="${project.url}" target="_blank" class="text-blue-500 hover:underline">View Details</a>` : ''}
            </div>
          `;

          marker.bindPopup(popupContent);
          marker.addTo(mapInstanceRef.current!);
          group.addLayer(marker);
          markersRef.current.push(marker);
        }
      });

      // Fit map to show all markers
      if (group.getLayers().length > 0) {
        mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [20, 20] });
      }
    }
  }, [projects]);

  return (
    <div className="w-full h-full">
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg border border-gray-300"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};

export default MapComponent;