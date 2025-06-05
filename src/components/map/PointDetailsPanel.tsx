
import React from 'react';
import { PontoResfriamento } from '@/services/supabaseService';
import { ForecastData } from '@/services/weatherService';
import { X, Clock, MapPin, Building, Thermometer, Droplets } from 'lucide-react';

interface PointDetailsPanelProps {
  point: PontoResfriamento;
  onClose: () => void;
  currentWeather?: ForecastData | null;
  userLocation?: { lat: number; lon: number };
}

const getTipoIcon = (tipo: PontoResfriamento['tipo']) => {
  switch (tipo) {
    case 'parque':
      return '🌳';
    case 'fonte':
      return '💧';
    case 'abrigo':
      return '🏠';
    default:
      return '📍';
  }
};

const getTipoLabel = (tipo: PontoResfriamento['tipo']) => {
  switch (tipo) {
    case 'parque':
      return 'Parque';
    case 'fonte':
      return 'Fonte de Água';
    case 'abrigo':
      return 'Abrigo Climatizado';
    default:
      return 'Ponto de Resfriamento';
  }
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const PointDetailsPanel: React.FC<PointDetailsPanelProps> = ({ 
  point, 
  onClose, 
  currentWeather, 
  userLocation 
}) => {
  const distance = userLocation 
    ? calculateDistance(userLocation.lat, userLocation.lon, point.latitude, point.longitude)
    : null;

  return (
    <div className="w-full bg-white shadow-xl border-l border-gray-200">
      <div className="p-4 bg-fiap-red text-white flex justify-between items-center">
        <h3 className="text-lg font-semibold truncate">{point.nome}</h3>
        <button 
          onClick={onClose} 
          className="text-white hover:text-gray-200 transition-colors p-1"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getTipoIcon(point.tipo)}</span>
          <div>
            <p className="font-medium text-fiap-gray-dark">{getTipoLabel(point.tipo)}</p>
            <p className="text-sm text-gray-600">{point.descricao}</p>
            {distance && (
              <p className="text-xs text-blue-600 font-medium">
                📍 {distance.toFixed(1)} km de você
              </p>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Clock className="h-4 w-4 text-fiap-red mt-0.5" />
            <div>
              <p className="text-sm font-medium text-fiap-gray-dark">Horário de Funcionamento</p>
              <p className="text-sm text-gray-600">{point.horario_funcionamento}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-fiap-red mt-0.5" />
            <div>
              <p className="text-sm font-medium text-fiap-gray-dark">Localização</p>
              <p className="text-sm text-gray-600">{point.cidade}, {point.uf}</p>
              <p className="text-xs text-gray-500">
                {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
              </p>
            </div>
          </div>
        </div>

        {/* Weather Information */}
        {currentWeather && (
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="font-semibold text-sm mb-2 text-blue-800">Condições Atuais</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{currentWeather.icon}</span>
                <div>
                  <p className="text-sm font-medium">{currentWeather.temperature}°C</p>
                  <p className="text-xs text-gray-600">{currentWeather.condition}</p>
                </div>
              </div>
              <div className="text-right text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Droplets className="h-3 w-3" />
                  <span>{currentWeather.humidity}%</span>
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  <span>☀️</span>
                  <span>UV {currentWeather.uv}</span>
                </div>
              </div>
            </div>
            
            {currentWeather.alerts.length > 0 && (
              <div className="mt-2 pt-2 border-t border-blue-200">
                <p className="text-xs font-medium text-orange-700 mb-1">Alertas:</p>
                {currentWeather.alerts.slice(0, 2).map((alert, index) => (
                  <p key={index} className="text-xs text-orange-600">{alert}</p>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <button 
            className="w-full bg-fiap-red text-white py-2 px-4 rounded-md hover:bg-fiap-red/90 transition-colors"
            onClick={() => {
              const coords = `${point.latitude},${point.longitude}`;
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${coords}`;
              window.open(mapsUrl, '_blank');
            }}
          >
            Como chegar
          </button>
          
          <button 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: point.nome,
                  text: `${point.descricao} - ${point.horario_funcionamento}`,
                  url: `https://www.google.com/maps/search/?api=1&query=${point.latitude},${point.longitude}`
                });
              }
            }}
          >
            Compartilhar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointDetailsPanel;
