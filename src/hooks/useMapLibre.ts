
import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';

interface UseMapLibreOptions {
  center?: [number, number];
  zoom?: number;
  style?: any;
}

interface MapInstance {
  map: maplibregl.Map | null;
  isLoaded: boolean;
  error: string | null;
}

export function useMapLibre(options: UseMapLibreOptions = {}): MapInstance & {
  mapContainer: React.RefObject<HTMLDivElement>;
  setCenter: (coordinates: [number, number]) => void;
  flyTo: (coordinates: [number, number], zoom?: number) => void;
} {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    center = [-46.6333, -23.5505], // São Paulo
    zoom = 10,
    style = {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors'
        }
      },
      layers: [
        {
          id: 'osm',
          type: 'raster',
          source: 'osm'
        }
      ]
    }
  } = options;

  const setCenter = useCallback((coordinates: [number, number]) => {
    if (map.current) {
      map.current.setCenter(coordinates);
    }
  }, []);

  const flyTo = useCallback((coordinates: [number, number], targetZoom?: number) => {
    if (map.current) {
      map.current.flyTo({
        center: coordinates,
        zoom: targetZoom || zoom,
        duration: 1000
      });
    }
  }, [zoom]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      setError(null);
      
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style,
        center,
        zoom
      });

      map.current.on('load', () => {
        console.log('MapLibre carregado com sucesso');
        setIsLoaded(true);
      });

      map.current.on('error', (e) => {
        console.error('Erro no MapLibre:', e);
        setError('Erro ao carregar o mapa');
      });

      // Add controls
      map.current.addControl(
        new maplibregl.NavigationControl({
          visualizePitch: true,
          showZoom: true,
          showCompass: true
        }),
        'top-right'
      );

      map.current.addControl(new maplibregl.ScaleControl(), 'bottom-left');

    } catch (error) {
      console.error('Erro ao inicializar MapLibre:', error);
      setError('Erro ao inicializar o mapa');
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        setIsLoaded(false);
      }
    };
  }, [center, zoom, style]);

  return {
    mapContainer,
    map: map.current,
    isLoaded,
    error,
    setCenter,
    flyTo
  };
}
