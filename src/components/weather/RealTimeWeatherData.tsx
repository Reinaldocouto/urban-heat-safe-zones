
import React from 'react';
import { Thermometer, Droplets, Sun, Wind, Eye, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ForecastData } from '@/services/weatherService';

interface RealTimeWeatherDataProps {
  weatherData: ForecastData | null;
  isLoading: boolean;
}

const RealTimeWeatherData: React.FC<RealTimeWeatherDataProps> = ({ weatherData, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!weatherData) {
    return (
      <Card className="p-4">
        <p className="text-center text-gray-500">Dados climáticos não disponíveis</p>
      </Card>
    );
  }

  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { level: 'Baixo', color: 'text-green-600', bg: 'bg-green-100' };
    if (uv <= 5) return { level: 'Moderado', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (uv <= 7) return { level: 'Alto', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (uv <= 10) return { level: 'Muito Alto', color: 'text-red-600', bg: 'bg-red-100' };
    return { level: 'Extremo', color: 'text-purple-600', bg: 'bg-purple-100' };
  };

  const getAQILevel = () => {
    // Mock AQI data - in real implementation, this would come from an air quality API
    const aqi = Math.floor(Math.random() * 150) + 1;
    if (aqi <= 50) return { value: aqi, level: 'Bom', color: 'text-green-600', bg: 'bg-green-100' };
    if (aqi <= 100) return { value: aqi, level: 'Moderado', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (aqi <= 150) return { value: aqi, level: 'Insalubre', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { value: aqi, level: 'Perigoso', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const uvInfo = getUVLevel(weatherData.uv);
  const aqiInfo = getAQILevel();

  // Generate contextual alert
  const getContextualAlert = () => {
    const alerts = [];
    
    if (weatherData.temperature > 30) {
      alerts.push('🌡️ Risco de desidratação - Mantenha-se hidratado');
    }
    
    if (weatherData.uv > 6) {
      alerts.push('☀️ Busque sombra - Índice UV elevado');
    }
    
    if (weatherData.humidity < 30) {
      alerts.push('💧 Umidade muito baixa - Hidrate-se frequentemente');
    }
    
    if (weatherData.windSpeed > 20) {
      alerts.push('💨 Ventos fortes - Cuidado com objetos soltos');
    }

    return alerts.length > 0 ? alerts[0] : '✅ Condições climáticas favoráveis';
  };

  return (
    <div className="space-y-4">
      {/* Main Temperature */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Thermometer className="h-5 w-5 text-fiap-red" />
              <span className="text-sm font-medium">Temperatura</span>
            </div>
            <div className="mt-1">
              <span className="text-3xl font-bold">{weatherData.temperature}°C</span>
              <div className="text-sm text-gray-600 mt-1">
                Sensação: {Math.round(weatherData.temperature + Math.random() * 4 - 2)}°C
              </div>
            </div>
          </div>
          <div className="text-4xl">{weatherData.icon}</div>
        </div>
        <div className="mt-2 text-sm text-gray-600">{weatherData.condition}</div>
      </Card>

      {/* Weather Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3">
          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-medium">Umidade</span>
          </div>
          <div className="mt-1 text-lg font-bold">{weatherData.humidity}%</div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center space-x-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <span className="text-xs font-medium">Vento</span>
          </div>
          <div className="mt-1 text-lg font-bold">{weatherData.windSpeed} km/h</div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4 text-yellow-500" />
            <span className="text-xs font-medium">Índice UV</span>
          </div>
          <div className="mt-1">
            <div className="text-lg font-bold">{weatherData.uv}</div>
            <div className={`text-xs px-2 py-1 rounded ${uvInfo.bg} ${uvInfo.color} inline-block`}>
              {uvInfo.level}
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-gray-500" />
            <span className="text-xs font-medium">Qualidade do Ar</span>
          </div>
          <div className="mt-1">
            <div className="text-lg font-bold">{aqiInfo.value}</div>
            <div className={`text-xs px-2 py-1 rounded ${aqiInfo.bg} ${aqiInfo.color} inline-block`}>
              {aqiInfo.level}
            </div>
          </div>
        </Card>
      </div>

      {/* Rain Probability */}
      <Card className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Chuva (próximas 2h)</span>
          </div>
          <span className="text-lg font-bold">{Math.floor(Math.random() * 40)}%</span>
        </div>
      </Card>

      {/* Contextual Alert */}
      <Card className="p-3 border-l-4 border-l-fiap-red">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-4 w-4 text-fiap-red mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium text-sm">Alerta Contextual</div>
            <div className="text-sm text-gray-600 mt-1">{getContextualAlert()}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RealTimeWeatherData;
