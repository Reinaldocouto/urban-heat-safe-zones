
import { useEffect, useState } from 'react';

interface GeolocationState {
  latitude?: number;
  longitude?: number;
  error?: string;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    loading: true
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        loading: false,
        error: 'Geolocalização não suportada pelo navegador'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false
        });
      },
      (error) => {
        console.error('Erro na geolocalização:', error);
        setState({
          loading: false,
          error: 'Erro ao obter localização. Verifique as permissões.'
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000
      }
    );
  }, []);

  return state;
}
