
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';

interface UseMapLibreOptions {
  center?: [number, number];
  zoom?: number;
  style?: string;
}

export function useMapLibre(options: UseMapLibreOptions = {}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const {
    center = [-46.6333, -23.5505], // São Paulo
    zoom = 10,
    style = 'https://api.maptiler.com/maps/streets/style.json?key=demo'
  } = options;

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style,
        center,
        zoom
      });

      map.current.on('load', () => {
        console.log('MapLibre carregado com sucesso');
        setIsMapLoaded(true);
      });

      map.current.on('error', (e) => {
        console.error('Erro no MapLibre:', e);
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
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        setIsMapLoaded(false);
      }
    };
  }, [center, zoom, style]);

  return {
    mapContainer,
    map: map.current,
    isMapLoaded
  };
}
