
import React from 'react';
import { X, MapPin, Clock, Navigation } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PontoResfriamento } from '@/services/supabaseService';
import { ForecastData } from '@/services/weatherService';
import { calculateDistance } from '@/utils/distance';

interface PointDetailsPanelProps {
  point: PontoResfriamento;
  onClose: () => void;
  userLocation?: { lat: number; lon: number };
  currentWeather?: ForecastData | null;
}

const PointDetailsPanel: React.FC<PointDetailsPanelProps> = ({ 
  point, 
  onClose,
  userLocation,
  currentWeather
}) => {
  const distance = userLocation 
    ? calculateDistance(userLocation.lat, userLocation.lon, point.latitude, point.longitude)
    : null;

  return (
    <div className="w-96 bg-white shadow-2xl border-l border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="bg-fiap-red text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Detalhes do Local</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Point Information */}
        <Card className="p-4 border-fiap-red/20 border-2">
          <h3 className="text-lg font-bold text-fiap-red mb-2">{point.nome}</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">Tipo:</span>
              <span className="capitalize bg-fiap-red/10 px-2 py-1 rounded text-fiap-red font-medium">
                {point.tipo}
              </span>
            </div>
            
            {point.descricao && (
              <div>
                <span className="font-medium text-gray-700">Descrição:</span>
                <p className="text-gray-600 mt-1">{point.descricao}</p>
              </div>
            )}
            
            {point.horario_funcionamento && (
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-fiap-red" />
                <span className="font-medium text-gray-700">Horário:</span>
                <span className="text-gray-600">{point.horario_funcionamento}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-fiap-red" />
              <span className="font-medium text-gray-700">Localização:</span>
              <span className="text-gray-600">{point.cidade}, {point.uf}</span>
            </div>
            
            {distance && (
              <div className="flex items-center space-x-2">
                <Navigation className="h-4 w-4 text-fiap-red" />
                <span className="font-medium text-gray-700">Distância:</span>
                <span className="text-gray-600 font-semibold">{distance.toFixed(1)} km</span>
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button className="w-full bg-fiap-red hover:bg-fiap-red/90 text-white">
            <Navigation className="h-4 w-4 mr-2" />
            Como chegar
          </Button>
          <Button variant="outline" className="w-full border-fiap-red text-fiap-red hover:bg-fiap-red/10">
            <MapPin className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PointDetailsPanel;
