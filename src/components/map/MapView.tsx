
import React, { useState, useCallback, useEffect } from 'react';

import { useToast } from '@/hooks/use-toast';
import { useGeolocation } from '@/hooks/useGeolocation';
import { PontoResfriamento } from '@/services/supabaseService';
import { findNearestPoint } from '@/utils/distance';
import { useMapData } from '@/hooks/useMapData';
import { calculateOptimalRoute, OptimizedRoute } from '@/services/routeService';
import { getForecastByCoordinates, ForecastData } from '@/services/weatherService';
import MapControls from './MapControls';
import WeatherNotification from './WeatherNotification';
import InteractiveMapArea from './InteractiveMapArea';
import PointDetailsPanel from './PointDetailsPanel';
import RouteInfoPanel from './RouteInfoPanel';

const MapView = () => {
  const [selectedPoint, setSelectedPoint] = useState<PontoResfriamento | null>(null);
  const [currentWeather, setCurrentWeather] = useState<ForecastData | null>(null);
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  const { latitude: userLat, longitude: userLon, loading: geoLoading, error: geoError } = useGeolocation();
  const { pontos, loading: dataLoading, error: dataError } = useMapData();
  const { toast } = useToast();

  // Load weather data when user location is available
  useEffect(() => {
    if (userLat && userLon) {
      getForecastByCoordinates(userLat, userLon)
        .then(weather => {
          setCurrentWeather(weather);
          console.log('Weather data loaded:', weather);
        })
        .catch(error => {
          console.error('Failed to load weather:', error);
        });
    }
  }, [userLat, userLon]);

  const handleFindNearest = useCallback(() => {
    if (!userLat || !userLon) {
      toast({ 
        title: 'Localização não disponível', 
        description: geoError || 'Permita o acesso à localização para encontrar o ponto mais próximo.', 
        variant: 'destructive' 
      });
      return;
    }
    
    if (pontos.length === 0) {
      toast({ 
        title: 'Nenhum ponto encontrado', 
        description: 'Não há pontos de resfriamento disponíveis no momento.', 
        variant: 'destructive' 
      });
      return;
    }
    
    try {
      const { point, distance } = findNearestPoint(userLat, userLon, pontos);
      setSelectedPoint(point);
      toast({ 
        title: 'Ponto mais próximo encontrado!', 
        description: `${point.nome} está a ${distance.toFixed(1)} km de você.` 
      });
    } catch (error) {
      toast({ 
        title: 'Erro ao encontrar ponto', 
        description: 'Não foi possível calcular o ponto mais próximo.', 
        variant: 'destructive' 
      });
    }
  }, [userLat, userLon, pontos, toast, geoError]);

  const handleCalculateOptimalRoute = useCallback(async () => {
    if (!userLat || !userLon || !selectedPoint) {
      toast({
        title: 'Dados insuficientes',
        description: 'Selecione um ponto de destino e permita acesso à localização.',
        variant: 'destructive'
      });
      return;
    }

    setIsCalculatingRoute(true);
    
    try {
      const route = await calculateOptimalRoute(
        userLat, 
        userLon, 
        selectedPoint.latitude, 
        selectedPoint.longitude
      );
      
      setOptimizedRoute(route);
      
      toast({
        title: 'Rota térmica calculada!',
        description: `Rota otimizada com ${route.coolingPoints.length} pontos de resfriamento encontrados.`
      });
    } catch (error) {
      console.error('Erro ao calcular rota:', error);
      toast({
        title: 'Erro no cálculo da rota',
        description: 'Não foi possível calcular a rota térmica otimizada.',
        variant: 'destructive'
      });
    } finally {
      setIsCalculatingRoute(false);
    }
  }, [userLat, userLon, selectedPoint, toast]);

  const handlePointSelect = (point: PontoResfriamento) => {
    setSelectedPoint(point);
    setOptimizedRoute(null); // Clear previous route when selecting new point
  };

  return (
    <div className="h-full flex flex-col lg:flex-row">
      <div className="flex-1 relative">
        {/* Área principal do mapa interativo */}
        <InteractiveMapArea 
          pontos={pontos}
          onPointSelect={handlePointSelect}
          selectedPoint={selectedPoint}
        />

        <MapControls 
          onFindNearest={handleFindNearest}
          onCalculateRoute={handleCalculateOptimalRoute}
          disabled={!userLat || !userLon || geoLoading}
          isCalculatingRoute={isCalculatingRoute}
          hasSelectedPoint={!!selectedPoint}
        />

        <WeatherNotification />
      </div>

      <div className="flex flex-col lg:w-96">
        {selectedPoint && (
          <PointDetailsPanel 
            point={selectedPoint} 
            onClose={() => {
              setSelectedPoint(null);
              setOptimizedRoute(null);
            }}
            currentWeather={currentWeather}
            userLocation={userLat && userLon ? { lat: userLat, lon: userLon } : undefined}
          />
        )}
        
        {optimizedRoute && (
          <RouteInfoPanel 
            route={optimizedRoute}
            onClose={() => setOptimizedRoute(null)}
          />
        )}
      </div>

      {(dataLoading || geoLoading || isCalculatingRoute) && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fiap-red mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">
              {isCalculatingRoute ? 'Calculando rota térmica...' : 
               geoLoading ? 'Obtendo localização...' : 'Carregando pontos...'}
            </p>
          </div>
        </div>
      )}

      {(dataError || geoError) && (
        <div className="absolute top-20 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <strong>Aviso:</strong> {dataError || geoError}
        </div>
      )}
    </div>
  );
};

export default MapView;
