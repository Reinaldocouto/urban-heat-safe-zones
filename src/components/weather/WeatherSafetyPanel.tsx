
import React, { useState, useEffect } from 'react';
import { X, RefreshCw, MapPin, Clock } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { getForecastByCoordinates, ForecastData } from '@/services/weatherService';
import { findNearestPoint } from '@/utils/distance';
import { useMapData } from '@/hooks/useMapData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RealTimeWeatherData from './RealTimeWeatherData';
import WeatherChart from './WeatherChart';
import NearbyPointsList from './NearbyPointsList';
import SafetyRecommendations from './SafetyRecommendations';

interface WeatherSafetyPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const WeatherSafetyPanel: React.FC<WeatherSafetyPanelProps> = ({ isOpen, onClose }) => {
  const [weatherData, setWeatherData] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const { latitude, longitude, loading: geoLoading, error: geoError } = useGeolocation();
  const { pontos } = useMapData();

  const loadWeatherData = async () => {
    if (!latitude || !longitude) return;
    
    setIsLoading(true);
    try {
      const data = await getForecastByCoordinates(latitude, longitude);
      setWeatherData(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao carregar dados climáticos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (latitude && longitude && isOpen) {
      loadWeatherData();
    }
  }, [latitude, longitude, isOpen]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      if (latitude && longitude) {
        loadWeatherData();
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [latitude, longitude, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto border-l border-gray-200">
      {/* Header */}
      <div className="bg-fiap-red text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Painel Clima Seguro</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={loadWeatherData}
            disabled={isLoading || !latitude || !longitude}
            className="text-white hover:bg-white/20"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {geoLoading && (
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 animate-spin text-fiap-red" />
              <span className="text-sm text-gray-600">Obtendo localização...</span>
            </div>
          </Card>
        )}

        {geoError && (
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <p className="text-sm text-yellow-800">
              Erro na geolocalização: {geoError}
            </p>
          </Card>
        )}

        {latitude && longitude && !geoError && (
          <>
            {/* Last Update */}
            {lastUpdate && (
              <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>
                  Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
                </span>
              </div>
            )}

            {/* Real-time Weather Data */}
            <RealTimeWeatherData 
              weatherData={weatherData} 
              isLoading={isLoading}
            />

            {/* Weather Chart */}
            <WeatherChart 
              latitude={latitude} 
              longitude={longitude}
            />

            {/* Safety Recommendations */}
            <SafetyRecommendations 
              weatherData={weatherData}
            />

            {/* Nearby Points */}
            <NearbyPointsList 
              userLat={latitude}
              userLon={longitude}
              pontos={pontos}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherSafetyPanel;
