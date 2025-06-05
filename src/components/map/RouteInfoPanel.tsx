
import React from 'react';
import { OptimizedRoute } from '@/services/routeService';
import { X, Route, Clock, AlertTriangle, Thermometer, Wind, Droplets } from 'lucide-react';

interface RouteInfoPanelProps {
  route: OptimizedRoute;
  onClose: () => void;
}

const RouteInfoPanel: React.FC<RouteInfoPanelProps> = ({ route, onClose }) => {
  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
    }
  };

  const getRiskLabel = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'Baixo';
      case 'medium': return 'Médio';
      case 'high': return 'Alto';
    }
  };

  return (
    <div className="bg-white shadow-xl border-t border-gray-200 max-h-96 overflow-y-auto">
      <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Route className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Rota Térmica</h3>
        </div>
        <button 
          onClick={onClose} 
          className="text-white hover:text-gray-200 transition-colors p-1"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Route Summary */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">Duração estimada</span>
            </div>
            <span className="text-sm font-semibold">{route.estimatedDuration} min</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">Risco térmico</span>
            </div>
            <span className={`text-sm font-semibold px-2 py-1 rounded ${getRiskColor(route.thermalRisk)}`}>
              {getRiskLabel(route.thermalRisk)}
            </span>
          </div>
        </div>

        {/* Weather Information */}
        {route.weatherData.route && (
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="font-semibold text-sm mb-2 text-blue-800">Condições Climáticas</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <Thermometer className="h-3 w-3" />
                <span>{route.weatherData.route.temperature}°C</span>
              </div>
              <div className="flex items-center space-x-1">
                <Droplets className="h-3 w-3" />
                <span>{route.weatherData.route.humidity}%</span>
              </div>
              <div className="flex items-center space-x-1">
                <Wind className="h-3 w-3" />
                <span>{route.weatherData.route.windSpeed} km/h</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>☀️</span>
                <span>UV {route.weatherData.route.uv}</span>
              </div>
            </div>
          </div>
        )}

        {/* Cooling Points */}
        <div>
          <h4 className="font-semibold text-sm mb-2 text-gray-800">
            Pontos de Resfriamento ({route.coolingPoints.length})
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {route.coolingPoints.map((point) => (
              <div key={point.id} className="bg-white border border-gray-200 rounded p-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {point.tipo === 'parque' ? '🌳' : point.tipo === 'fonte' ? '💧' : '🏠'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{point.nome}</p>
                    <p className="text-xs text-gray-500">{point.cidade}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {route.recommendations.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2 text-gray-800">Recomendações</h4>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {route.recommendations.map((recommendation, index) => (
                <div key={index} className="text-xs text-gray-700 bg-yellow-50 p-2 rounded">
                  {recommendation}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 border-t border-gray-200">
          <button 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
            onClick={() => {
              // Here you could integrate with a mapping service
              const startCoords = `${route.startPoint.latitude},${route.startPoint.longitude}`;
              const endCoords = `${route.endPoint.latitude},${route.endPoint.longitude}`;
              const mapsUrl = `https://www.google.com/maps/dir/${startCoords}/${endCoords}`;
              window.open(mapsUrl, '_blank');
            }}
          >
            Abrir no Google Maps
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteInfoPanel;
