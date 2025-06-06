
import React, { useState, useCallback, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGeolocation } from '@/hooks/useGeolocation';
import { PontoResfriamento } from '@/services/supabaseService';
import { findNearestPoint } from '@/utils/distance';
import { useMapData } from '@/hooks/useMapData';
import { calculateOptimalRoute, OptimizedRoute } from '@/services/routeService';
import { getForecastByCoordinates, ForecastData } from '@/services/weatherService';
import { Button } from '@/components/ui/button';
import MapControls from './MapControls';
import WeatherNotification from './WeatherNotification';
import InteractiveMapArea from './InteractiveMapArea';
import PointDetailsPanel from './PointDetailsPanel';
import RouteInfoPanel from './RouteInfoPanel';
import WeatherSafetyPanel from '../weather/WeatherSafetyPanel';
import CurrentWeatherWidget from './CurrentWeatherWidget';

const MapView = () => {
  const [selectedPoint, setSelectedPoint] = useState<PontoResfriamento | null>(null);
  const [currentWeather, setCurrentWeather] = useState<ForecastData | null>(null);
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [isWeatherPanelOpen, setIsWeatherPanelOpen] = useState(false);

  const { latitude: userLat, longitude: userLon, loading: geoLoading, error: geoError } = useGeolocation();
  const { pontos, loading: dataLoading, error: dataError } = useMapData();
  const { toast } = useToast();

  // Auto-open weather panel when geolocation is detected
  useEffect(() => {
    if (userLat && userLon && !geoError) {
      setIsWeatherPanelOpen(true);
    }
  }, [userLat, userLon, geoError]);

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
    <div className="h-full flex flex-col bg-fiap-gray-light">
      <div className="flex-1 relative flex">
        {/* Main map area */}
        <div className={`flex-1 transition-all duration-300 ${isWeatherPanelOpen ? 'mr-96' : ''}`}>
          <InteractiveMapArea 
            pontos={pontos}
            onPointSelect={handlePointSelect}
            selectedPoint={selectedPoint}
          />

          {/* Map Controls - top left */}
          <div className="absolute top-4 left-4 z-20 space-y-3">
            <MapControls 
              onFindNearest={handleFindNearest}
              onCalculateRoute={handleCalculateOptimalRoute}
              disabled={!userLat || !userLon || geoLoading}
              isCalculatingRoute={isCalculatingRoute}
              hasSelectedPoint={!!selectedPoint}
            />
          </div>

          {/* Current Weather Widget - bottom left, positioned to not obstruct panels */}
          {userLat && userLon && !geoError && currentWeather && (
            <div className="absolute bottom-4 left-4 z-20">
              <CurrentWeatherWidget 
                weatherData={currentWeather}
                isCompact={true}
              />
            </div>
          )}

          {/* Weather Panel Toggle Button - top right */}
          {userLat && userLon && !geoError && (
            <div className="absolute top-4 right-4 z-20">
              <Button
                onClick={() => setIsWeatherPanelOpen(!isWeatherPanelOpen)}
                className="bg-fiap-red hover:bg-fiap-red/90 text-white shadow-lg border-2 border-white/20 backdrop-blur-sm"
                size="sm"
              >
                <Activity className="h-4 w-4 mr-2" />
                {isWeatherPanelOpen ? 'Fechar Painel' : 'Clima Seguro'}
              </Button>
            </div>
          )}

          <WeatherNotification />
        </div>

        {/* Side panels container */}
        <div className="flex flex-col">
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
      </div>

      {/* Weather Safety Panel */}
      <WeatherSafetyPanel 
        isOpen={isWeatherPanelOpen}
        onClose={() => setIsWeatherPanelOpen(false)}
      />

      {(dataLoading || geoLoading || isCalculatingRoute) && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-fiap-red/20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fiap-red mx-auto"></div>
            <p className="mt-3 text-sm text-gray-700 font-medium">
              {isCalculatingRoute ? 'Calculando rota térmica...' : 
               geoLoading ? 'Obtendo localização...' : 'Carregando pontos...'}
            </p>
          </div>
        </div>
      )}

      {(dataError || geoError) && (
        <div className="absolute top-20 left-4 right-4 bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg z-50 shadow-lg backdrop-blur-sm">
          <strong>Aviso:</strong> {dataError || geoError}
        </div>
      )}
    </div>
  );
};

export default MapView;
