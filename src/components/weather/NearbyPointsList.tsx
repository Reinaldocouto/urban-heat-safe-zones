
import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PontoResfriamento } from '@/services/supabaseService';
import { calculateDistance } from '@/utils/distance';

interface NearbyPointsListProps {
  userLat: number;
  userLon: number;
  pontos: PontoResfriamento[];
}

const NearbyPointsList: React.FC<NearbyPointsListProps> = ({ userLat, userLon, pontos }) => {
  // Calculate distances and sort by proximity
  const nearbyPoints = pontos
    .map(point => ({
      ...point,
      distance: calculateDistance(userLat, userLon, point.latitude, point.longitude)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5); // Show only the 5 closest points

  const getTypeIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'parque':
        return '🌳';
      case 'shopping':
        return '🏢';
      case 'hospital':
        return '🏥';
      case 'escola':
        return '🏫';
      case 'biblioteca':
        return '📚';
      default:
        return '📍';
    }
  };

  const getTypeColor = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'parque':
        return 'text-green-600 bg-green-100';
      case 'shopping':
        return 'text-blue-600 bg-blue-100';
      case 'hospital':
        return 'text-red-600 bg-red-100';
      case 'escola':
        return 'text-purple-600 bg-purple-100';
      case 'biblioteca':
        return 'text-indigo-600 bg-indigo-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (nearbyPoints.length === 0) {
    return (
      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-fiap-red" />
          Pontos de Apoio Próximos
        </h3>
        <p className="text-sm text-gray-500 text-center">
          Nenhum ponto de apoio encontrado nas proximidades
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-3 flex items-center">
        <MapPin className="h-4 w-4 mr-2 text-fiap-red" />
        Pontos de Apoio Próximos
      </h3>
      <div className="space-y-3">
        {nearbyPoints.map((point) => (
          <div key={point.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg">{getTypeIcon(point.tipo)}</span>
                  <span className="font-medium text-sm">{point.nome}</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(point.tipo)}`}>
                    {point.tipo}
                  </span>
                  <span className="text-xs text-gray-500">
                    📍 {point.distance.toFixed(1)} km
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{point.cidade}, {point.uf}</p>
                {point.horario_funcionamento && (
                  <p className="text-xs text-gray-500">
                    🕒 {point.horario_funcionamento}
                  </p>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="ml-2 flex-shrink-0"
                onClick={() => {
                  // Open directions in Google Maps
                  const url = `https://www.google.com/maps/dir/${userLat},${userLon}/${point.latitude},${point.longitude}`;
                  window.open(url, '_blank');
                }}
              >
                <Navigation className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default NearbyPointsList;
