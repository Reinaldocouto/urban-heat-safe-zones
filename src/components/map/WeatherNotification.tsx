
import React, { useState, useEffect } from 'react';
import { getForecastByCoordinates, ForecastData } from '@/services/weatherService';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Thermometer, Droplets, Sun, RefreshCw } from 'lucide-react';

const WeatherNotification: React.FC = () => {
  const { latitude: lat, longitude: lon } = useGeolocation();
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchWeatherData = async () => {
    if (lat && lon && !loading) {
      setLoading(true);
      try {
        const data = await getForecastByCoordinates(lat, lon);
        setForecast(data);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Erro ao atualizar clima:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [lat, lon]);

  if (!forecast) return null;

  return (
    <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 text-sm">Clima Atual</h3>
        <button
          onClick={fetchWeatherData}
          disabled={loading}
          className="text-fiap-red hover:text-fiap-red/80 transition-colors disabled:opacity-50"
          title="Atualizar dados do clima"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="flex items-center space-x-3 mb-3">
        <span className="text-3xl" title={forecast.condition}>
          {forecast.icon}
        </span>
        <div>
          <div className="flex items-center space-x-1">
            <Thermometer className="h-4 w-4 text-fiap-red" />
            <span className="font-bold text-xl text-gray-800">{forecast.temperature}°C</span>
          </div>
          <span className="text-sm text-gray-600">{forecast.condition}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
        <div className="flex items-center space-x-1">
          <Droplets className="h-3 w-3 text-blue-500" />
          <span>Umidade: {forecast.humidity}%</span>
        </div>
        <div className="flex items-center space-x-1">
          <Sun className="h-3 w-3 text-yellow-500" />
          <span>UV: {forecast.uv}</span>
        </div>
      </div>
      
      {forecast.alerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-3">
          <p className="text-xs font-medium text-yellow-800 mb-1">⚠️ Alertas:</p>
          <p className="text-xs text-yellow-700">{forecast.alerts[0]}</p>
        </div>
      )}
      
      {lastUpdate && (
        <p className="text-xs text-gray-400 text-center">
          Atualizado às {lastUpdate.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      )}
    </div>
  );
};

export default WeatherNotification;
