
import React, { useEffect, useState } from 'react';
import { getForecastByCoordinates, ForecastData } from '@/services/weatherService';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Thermometer, Droplets, Sun } from 'lucide-react';

const TemperatureDisplay: React.FC = () => {
  const { latitude: lat, longitude: lon } = useGeolocation();
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (lat && lon) {
        setLoading(true);
        const data = await getForecastByCoordinates(lat, lon);
        setForecast(data);
        setLoading(false);
      }
    }
    fetchData();
  }, [lat, lon]);

  if (loading) {
    return (
      <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
        <div className="animate-pulse">Carregando clima...</div>
      </div>
    );
  }

  if (!forecast) return null;

  return (
    <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md max-w-xs">
      <div className="flex items-center space-x-3 mb-2">
        <img 
          src={`https:${forecast.icon}`} 
          alt={forecast.condition} 
          className="w-8 h-8" 
        />
        <div>
          <div className="flex items-center space-x-1">
            <Thermometer className="h-4 w-4 text-fiap-red" />
            <span className="font-semibold text-lg">{forecast.temperature}°C</span>
          </div>
          <span className="text-sm text-gray-600">{forecast.condition}</span>
        </div>
      </div>
      
      <div className="flex justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <Droplets className="h-3 w-3" />
          <span>{forecast.humidity}%</span>
        </div>
        <div className="flex items-center space-x-1">
          <Sun className="h-3 w-3" />
          <span>UV {forecast.uv}</span>
        </div>
      </div>
      
      {forecast.alerts.length > 0 && (
        <div className="mt-2 p-2 bg-yellow-100 rounded text-xs">
          <strong>Alertas:</strong> {forecast.alerts[0]}
        </div>
      )}
    </div>
  );
};

export default TemperatureDisplay;
