
import React from 'react';
import { Thermometer, Droplets, Sun, Wind } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ForecastData } from '@/services/weatherService';

interface CurrentWeatherWidgetProps {
  weatherData: ForecastData;
  isCompact?: boolean;
}

const CurrentWeatherWidget: React.FC<CurrentWeatherWidgetProps> = ({ 
  weatherData, 
  isCompact = false 
}) => {
  const getUVColor = (uv: number) => {
    if (uv <= 2) return 'text-green-600';
    if (uv <= 5) return 'text-yellow-600';
    if (uv <= 7) return 'text-orange-600';
    if (uv <= 10) return 'text-red-600';
    return 'text-purple-600';
  };

  if (isCompact) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-fiap-red/20 border-2 shadow-lg p-3 w-64">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-fiap-red">Clima Atual</h3>
          <span className="text-2xl">{weatherData.icon}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <Thermometer className="h-3 w-3 text-fiap-red" />
            <span className="font-semibold">{weatherData.temperature}°C</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Droplets className="h-3 w-3 text-blue-500" />
            <span>{weatherData.humidity}%</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Sun className={`h-3 w-3 ${getUVColor(weatherData.uv)}`} />
            <span>UV {weatherData.uv}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Wind className="h-3 w-3 text-gray-500" />
            <span>{weatherData.windSpeed}km/h</span>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-600 bg-fiap-red/5 p-2 rounded border-l-2 border-fiap-red">
          {weatherData.condition}
        </div>
      </Card>
    );
  }

  // Full version (for potential future use)
  return (
    <Card className="bg-white/95 backdrop-blur-sm border-fiap-red/20 border-2 shadow-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-fiap-red">Clima Atual</h3>
        <span className="text-3xl">{weatherData.icon}</span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-4 w-4 text-fiap-red" />
            <span className="text-sm font-medium">Temperatura</span>
          </div>
          <span className="text-xl font-bold">{weatherData.temperature}°C</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center">
            <Droplets className="h-4 w-4 text-blue-500 mx-auto mb-1" />
            <div className="font-semibold">{weatherData.humidity}%</div>
            <div className="text-xs text-gray-600">Umidade</div>
          </div>
          
          <div className="text-center">
            <Sun className={`h-4 w-4 mx-auto mb-1 ${getUVColor(weatherData.uv)}`} />
            <div className="font-semibold">{weatherData.uv}</div>
            <div className="text-xs text-gray-600">UV</div>
          </div>
          
          <div className="text-center">
            <Wind className="h-4 w-4 text-gray-500 mx-auto mb-1" />
            <div className="font-semibold">{weatherData.windSpeed}</div>
            <div className="text-xs text-gray-600">km/h</div>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 bg-fiap-red/5 p-2 rounded border-l-2 border-fiap-red">
          {weatherData.condition}
        </div>
      </div>
    </Card>
  );
};

export default CurrentWeatherWidget;
